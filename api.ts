import {
  collection,
  getDocs,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  arrayUnion
} from 'firebase/firestore';
import { db } from './firebaseConfig';
import { Group, Member } from './zustandStore';

export interface CreateGroupParams {
  members: string[];
}

export interface CreateUserParams {
  userId: string;
  username: string;
}

export const createUser = async (
  params: CreateUserParams,
  id?: string
): Promise<string> => {
  try {
    const docRef = doc(collection(db, 'users'), id); // Directly use the provided ID

    await setDoc(docRef, params);
    return docRef.id;
  } catch (error) {
    console.error('Error creating user:', error);
    throw new Error('Failed to create user');
  }
};

export const userGroups = async (
  userId: string,
  setSelectedGroup: (group: Group | undefined) => void
) => {
  try {
    const groupsRef = collection(db, 'groups');
    const querySnapshot = await getDocs(groupsRef);
    const today = new Date().toLocaleDateString(); // Get the current date as a string

    const groups: Group[] = querySnapshot.docs
      .map((doc) => {
        const data = doc.data();
        const members: Member[] = data.members || [];
        const group: Group = {
          id: doc.id,
          groupName: data.groupName,
          members
        };

        if (data.lastUpdated !== today || data.dailyIndex === undefined) {
          const newIndex = Math.floor(Math.random() * members.length);
          console.log('we are assigning a new index todya');
          updateDoc(doc.ref, {
            dailyIndex: newIndex,
            lastUpdated: today
          });
          group.dailyIndex = newIndex;
        } else {
          group.dailyIndex = data.dailyIndex;
        }

        return group;
      })
      .filter((group) => group.members.some((member) => member.id === userId));

    if (groups.length > 0) {
      setSelectedGroup(groups[0]);
    } else {
      setSelectedGroup(undefined);
    }

    return groups;
  } catch (error) {
    console.error('Error fetching user groups:', error);
  }
};

export const createGroup = async (params: {
  members: Member[];
  groupName: string;
}): Promise<string> => {
  try {
    const docRef = doc(collection(db, 'groups'));
    await setDoc(docRef, params);
    const createdDoc = await getDoc(docRef);
    return docRef.id;
  } catch (error) {
    console.error('Error creating group:', error);
    throw new Error('Failed to create group');
  }
};

export const joinGroup = async (
  groupId: string,
  userId: string,
  username: string
): Promise<Group | null> => {
  try {
    const groupRef = doc(db, 'groups', groupId);

    await updateDoc(groupRef, {
      members: arrayUnion({ id: userId, username: username })
    });

    const updatedGroupDoc = await getDoc(groupRef);
    const newGroup: Group = {
      id: groupId,
      groupName: updatedGroupDoc.data()?.groupName || '',
      members: (updatedGroupDoc.data()?.members || []) as Member[]
    };

    return newGroup;
  } catch (error) {
    console.error('Error joining group:', error);
    return null;
  }
};

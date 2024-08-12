import {
  collection,
  getDocs,
  query,
  where,
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
    const docRef = id
      ? doc(collection(db, 'users'), id)
      : doc(collection(db, 'users'));

    await setDoc(docRef, params);
    const createdDoc = await getDoc(docRef);

    return docRef.id;
  } catch (error) {
    console.error('Error creating user:', error);
    throw new Error('Failed to create user');
  }
};
export const userGroups = async (userId: string) => {
  try {
    const groupsRef = collection(db, 'groups');
    const querySnapshot = await getDocs(groupsRef);

    // Filter groups based on userId
    const groups: Group[] = querySnapshot.docs
      .map((doc) => {
        const data = doc.data();
        const members: Member[] = data.members || [];
        return {
          id: doc.id,
          groupName: data.groupName,
          members
        };
      })
      .filter((group) => group.members.some((member) => member.id === userId));

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

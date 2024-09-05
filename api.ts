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
import { Group, User } from './zustandStore';

export interface CreateGroupParams {
  members: string[];
}

export const createUser = async (userData: User): Promise<string> => {
  try {
    const docRef = doc(collection(db, 'users'), userData.id);
    await setDoc(docRef, userData);
    return docRef.id;
  } catch (error) {
    console.error('Error creating user:', error);
    throw new Error('Failed to create user');
  }
};

export const populateGroups = async (
  id: string,
  setSelectedGroup: (group: Group | undefined) => void
): Promise<Group[]> => {
  try {
    const groupsRef = collection(db, 'groups');
    const querySnapshot = await getDocs(groupsRef);
    const today = new Date().toLocaleDateString();

    const groups: Group[] = await Promise.all(
      querySnapshot.docs.map(async (doc) => {
        const data = doc.data();
        const members: User[] = data.members || [];
        const currentDailyIndex = data.dailyIndex || 0;
        const currentSelectedMember = data.selectedMember || {
          id: '',
          username: ''
        };

        let dailyIndex = currentDailyIndex;
        let selectedMember = currentSelectedMember;

        // Check if we need to update the dailyIndex
        if (data.lastUpdated !== today) {
          dailyIndex = Math.floor(Math.random() * members.length);
          console.log('Assigning a new index today');
          await updateDoc(doc.ref, {
            dailyIndex,
            lastUpdated: today,
            votesYes: []
          });
        }

        // Check if the selectedMember needs to be updated
        const newSelectedMember = members[dailyIndex];
        if (newSelectedMember && newSelectedMember.id !== selectedMember.id) {
          selectedMember = newSelectedMember;
          console.log('we have updated the selectedMember');
          // Update the group document with the new selectedMember
          await updateDoc(doc.ref, {
            selectedMember
          });
        }

        const group: Group = {
          id: doc.id,
          groupName: data.groupName || '',
          members,
          dailyIndex,
          lastUpdated: data.lastUpdated || '',
          votesYes: data.votesYes || [],
          selectedMember
        };

        return group;
      })
    );

    // Filter groups to include only those where the user is a member
    const userGroups = groups.filter((group) =>
      group.members.some((member) => member.id === id)
    );

    // Set the first group as the selected group if any exist
    if (userGroups.length > 0) {
      setSelectedGroup(userGroups[0]);
    } else {
      setSelectedGroup(undefined);
    }

    return userGroups;
  } catch (error) {
    console.error('Error fetching user groups:', error);
    return [];
  }
};

export const createGroup = async (params: {
  members: User[];
  groupName: string;
  dailyIndex?: number;
  lastUpdated?: string;
  votesYes: [];
  selectedMember: User;
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

export const logDebugInfo = async (debugData: any) => {
  try {
    const debugDocRef = doc(collection(db, 'debugLogs')); // 'debugLogs' is the collection for storing logs
    await setDoc(debugDocRef, {
      timestamp: new Date().toISOString(),
      data: JSON.stringify(debugData, null, 2) // Pretty print JSON
    });
  } catch (error) {
    console.error('Failed to log debug info:', error);
  }
};

export const joinGroup = async (
  groupId: string,
  user: User
): Promise<Group | null> => {
  try {
    const groupRef = doc(db, 'groups', groupId);

    await updateDoc(groupRef, {
      members: arrayUnion(user)
    });

    const updatedGroupDoc = await getDoc(groupRef);
    const newGroup: Group = {
      id: groupId,
      groupName: updatedGroupDoc.data()?.groupName || '',
      members: (updatedGroupDoc.data()?.members || []) as User[],
      dailyIndex: updatedGroupDoc.data()?.dailyIndex || 0,
      lastUpdated: updatedGroupDoc.data()?.lastUpdated || '',
      votesYes: updatedGroupDoc.data()?.votesYes || [],
      selectedMember: updatedGroupDoc.data()?.selectedMember || ''
    };

    return newGroup;
  } catch (error) {
    console.error('Error joining group:', error);
    return null;
  }
};

export const voteYes = async (groupId: string, user: User) => {
  try {
    const groupRef = doc(db, 'groups', groupId);
    await updateDoc(groupRef, {
      votesYes: arrayUnion(user)
    });
  } catch (error) {
    console.error('Error adding vote:', error);
  }
};

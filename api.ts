import {
  collection,
  getDocs,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  arrayUnion,
  query,
  where,
  writeBatch,
  DocumentSnapshot,
  DocumentReference
} from 'firebase/firestore';
import { db } from './firebaseConfig';
import { Group, User } from './zustandStore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { userConverter } from './app/firestoreConverters';

export const createUser = async (user: User) => {
  try {
    const userDocRef = doc(db, 'users', user.id).withConverter(userConverter);
    await setDoc(userDocRef, user);
  } catch (error) {
    console.error('Error creating user:', error);
  }
};

export const populateGroups = async (
  user: User,
  groupIds: string[],
  setSelectedGroup: (group: Group | undefined) => void,
  selectedGroup: Group | undefined
): Promise<Group[]> => {
  try {
    const groupsRef = collection(db, 'groups');
    const groupQuery = query(groupsRef, where('__name__', 'in', groupIds));
    const groupSnapshots = await getDocs(groupQuery);

    const today = new Date().toLocaleDateString();

    const allGroups: Group[] = [];

    for (const docSnapshot of groupSnapshots.docs) {
      const data = docSnapshot.data() as Group;

      if (data.lastUpdated !== today) {
        console.log(`Group ${docSnapshot.id} needs to be updated.`);

        // Update the group data
        data.lastUpdated = today;
        data.dailyIndex = Math.floor(Math.random() * data.members.length);

        // Write the updated data back to Firestore
        const groupRef = doc(db, 'groups', docSnapshot.id);
        await updateDoc(groupRef, {
          lastUpdated: data.lastUpdated,
          dailyIndex: data.dailyIndex
        });
      } else {
        console.log(
          `Group ${docSnapshot.id} was did not need to be updated today.`
        );
      }

      allGroups.push(data);
    }

    setSelectedGroup(allGroups[0]);
    // Optionally set the selected group if needed
    // if (selectedGroup && updatedGroups.length > 0) {
    //   setSelectedGroup(
    //     updatedGroups.find((group) => group.id === selectedGroup.id)
    //   );
    // }

    return allGroups;
  } catch (error) {
    console.error('Failed to populate groups:', error);
    return [];
  }
};

export const createGroup = async (params: {
  groupName: string;
  members: DocumentReference<User>[];
  dailyIndex?: number;
  lastUpdated?: string;
  votesYes: DocumentReference<User>[];
}): Promise<string> => {
  try {
    const docRef = doc(collection(db, 'groups'));
    await setDoc(docRef, {
      ...params
    });
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

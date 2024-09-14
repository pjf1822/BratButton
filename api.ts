import {
  collection,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  arrayUnion
} from 'firebase/firestore';
import { db } from './firebaseConfig';
import { Group, User } from './zustandStore';
import { userConverter } from './firestoreConverters';

export const createUser = async (user: User) => {
  try {
    const userDocRef = doc(db, 'users', user.id).withConverter(userConverter);
    await setDoc(userDocRef, user);
  } catch (error) {
    console.error('Error creating user:', error);
  }
};

export const createGroup = async (params: {
  groupName: string;
  members: User[];
  lastUpdated?: string;
  votesYes: [];
  dailyIndex?: number;
}): Promise<string> => {
  try {
    const docRef = doc(collection(db, 'groups'));
    const id = docRef.id;

    await setDoc(docRef, {
      id,
      ...params
    });

    return id;
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
      members: updatedGroupDoc.data()?.members as User[],
      dailyIndex: updatedGroupDoc.data()?.dailyIndex || 0,
      lastUpdated: updatedGroupDoc.data()?.lastUpdated || '',
      votesYes: updatedGroupDoc.data()?.votesYes || []
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
      votesYes: arrayUnion(user.id)
    });
  } catch (error) {
    console.error('Error adding vote:', error);
  }
};

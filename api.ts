import {
  collection,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  arrayUnion,
  DocumentReference
} from 'firebase/firestore';
import { db } from './firebaseConfig';
import { Group, User } from './zustandStore';
import { userConverter } from './app/firestoreConverters';

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
  members: DocumentReference<User>[];
  lastUpdated?: string;
  votesYes: DocumentReference<User>[];
  dailyIndex?: number;
  selectedMember: DocumentReference<User>;
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

import {
  collection,
  doc,
  setDoc,
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

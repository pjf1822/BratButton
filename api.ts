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
import { Group } from './zustandStore';

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
    const q = query(groupsRef, where('members', 'array-contains', userId));

    const querySnapshot = await getDocs(q);

    const groups = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    }));
    return groups;
  } catch (error) {
    console.error('Error fetching user groups:', error);
  }
};

export const createGroup = async (params: {
  members: string[];
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
  userId: string
): Promise<Group | null> => {
  try {
    const groupRef = doc(db, 'groups', groupId);

    await updateDoc(groupRef, {
      members: arrayUnion(userId)
    });

    const updatedGroupDoc = await getDoc(groupRef);

    const newGroup: Group = {
      id: groupId,
      groupName:
        updatedGroupDoc?._document?.data?.value?.mapValue?.fields?.groupName
          ?.stringValue,
      members:
        updatedGroupDoc?._document?.data?.value?.mapValue?.fields?.members?.arrayValue?.values.map(
          (member: object) => member?.stringValue
        )
    };

    return newGroup;
  } catch (error) {
    console.error('Error joining group:', error);
    return null;
  }
};

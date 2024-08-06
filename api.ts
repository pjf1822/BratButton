import { useMutation, useQuery } from "react-query";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import { db } from "./firebaseConfig";

export interface Group {
  id: string;
  name: string;
  members: string[];
}

export interface CreateGroupParams {
  members: string[];
}

export interface CreateUserParams {
  userId: string;
}
export const getData = async (collectionName: string) => {
  try {
    const querySnapshot = await getDocs(collection(db, collectionName));
    const data = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    console.log(data, "what is this grabbbing");
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw new Error("Error fetching data");
  }
};

export const userGroups = async (userId: string) => {
  try {
    const groupsRef = collection(db, "groups");
    const q = query(groupsRef, where("members", "array-contains", userId));

    const querySnapshot = await getDocs(q);

    const groups = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return groups;
  } catch (error) {
    console.error("Error fetching user groups:", error);
  }
};

export const createUser = async (
  params: CreateUserParams,
  id?: string
): Promise<string> => {
  try {
    const docRef = id
      ? doc(collection(db, "users"), id)
      : doc(collection(db, "users"));

    await setDoc(docRef, params);
    const createdDoc = await getDoc(docRef);

    return docRef.id;
  } catch (error) {
    console.error("Error creating user:", error);
    throw new Error("Failed to create user");
  }
};

export const createGroup = async (
  params: CreateGroupParams,
  id?: string
): Promise<string> => {
  try {
    const docRef = id
      ? doc(collection(db, "groups"), id)
      : doc(collection(db, "groups"));

    await setDoc(docRef, params);
    const createdDoc = await getDoc(docRef);
    console.log("Created group:", { id: createdDoc.id, ...createdDoc.data() });

    return docRef.id;
  } catch (error) {
    console.error("Error creating group:", error);
    throw new Error("Failed to create group");
  }
};

export const joinGroup = async (
  groupId: string,
  userId: string
): Promise<void> => {
  try {
    // Reference to the group document
    const groupRef = doc(db, "groups", groupId);

    // Update the group's members array to include the new userId
    await updateDoc(groupRef, {
      members: arrayUnion(userId), // Add userId to the members array, avoiding duplicates
    });

    console.log(`User ${userId} joined group ${groupId}`);
  } catch (error) {
    console.error("Error joining group:", error);
    throw new Error("Failed to join group");
  }
};

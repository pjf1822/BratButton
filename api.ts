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
    // Query to find groups where the userId is a member
    const groupsRef = collection(db, "groups");
    // console.log(groupsRef, "the groups ref");
    const q = query(groupsRef, where("members", "array-contains", userId));

    // console.log(q, "the q");
    // Fetch the documents
    const querySnapshot = await getDocs(q);
    // console.log(querySnapshot, "the query snapshot");

    // Extract data
    const groups = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    console.log(groups, "Groups containing userId");
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

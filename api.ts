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
export const getData = async (collectionName: string) => {
  try {
    const querySnapshot = await getDocs(collection(db, collectionName));
    const data = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    console.log(data);
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw new Error("Error fetching data");
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

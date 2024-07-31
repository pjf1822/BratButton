import { useMutation, useQuery } from "react-query";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import { db } from "./firebaseConfig";
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

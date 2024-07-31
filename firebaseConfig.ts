import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB12TYIqRdaXuGuQbHA65-dAgPVallkBHY",
  authDomain: "bitchbutton.firebaseapp.com",
  projectId: "bitchbutton",
  storageBucket: "bitchbutton.appspot.com",
  messagingSenderId: "798285938993",
  appId: "1:798285938993:web:2d4890083e0f31129eb010",
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

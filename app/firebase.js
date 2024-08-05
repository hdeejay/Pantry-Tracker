import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
const firebaseConfig = {
  apiKey: "AIzaSyDwFj-2u2jjndcUxVai3kDPhK_i2bLziNM",
  authDomain: "inventorymanagment-3e777.firebaseapp.com",
  projectId: "inventorymanagment-3e777",
  storageBucket: "inventorymanagment-3e777.appspot.com",
  messagingSenderId: "626280333572",
  appId: "1:626280333572:web:f084e7b6671225a4179051",
  measurementId: "G-SB0HVXYXF4"
};

const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);
export { app, firestore, auth,storage};






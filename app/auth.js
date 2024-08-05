// import { auth } from "../app/firebase";
// import {
//     createUserWithEmailAndPassword,
//     signInWithEmailAndPassword,
//     sendPasswordResetEmail,
//     sendEmailVerification,
//     updatePassword,
//     signInWithPopup,
//     GoogleAuthProvider,
// } from "firebase/auth";

// export const doCreateUserWithEmailAndPassword = async (email, password) => {
//     return createUserWithEmailAndPassword(auth, email, password);
// };

// export const doSignInWithEmailAndPassword = (email, password) => {
//     return signInWithEmailAndPassword(auth, email, password);
// };

// export const doSignInWithGoogle = async () => {
//     const provider = new GoogleAuthProvider();
//     const result = await signInWithPopup(auth, provider);
//     const user = result.user;

//     // add user to firestore
// };

// export const doSignOut = () => {
//     return auth.signOut();
// };

// export const doPasswordReset = (email) => {
//     return sendPasswordResetEmail(auth, email);
// };

// export const doPasswordChange = (password) => {
//     return updatePassword(auth.currentUser, password);
// };

// export const doSendEmailVerification = () => {
//     return sendEmailVerification(auth.currentUser, {
//         url: `${window.location.origin}/home`,
//     });
// };

// import { auth } from './firebase';
// import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

// const googleProvider = new GoogleAuthProvider();

// export const signInWithGoogle = async () => {
//   try {
//     const result = await signInWithPopup(auth, googleProvider);
//     return result.user;
//   } catch (error) {
//     console.error("Error signing in with Google:", error);
//     throw error;
//   }
// };

// export const signOut = () => auth.signOut();
import { auth } from './firebase';
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut
} from 'firebase/auth';

const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error("Error signing in with Google:", error);
    throw error;
  }
};

export const doCreateUserWithEmailAndPassword = async (email, password) => {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    return result.user;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

export const doSignInWithEmailAndPassword = async (email, password) => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return result.user;
  } catch (error) {
    console.error("Error signing in:", error);
    throw error;
  }
};

export const signOut = () => firebaseSignOut(auth);
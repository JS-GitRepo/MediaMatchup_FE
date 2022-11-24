import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import * as firebaseui from "firebaseui";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
const firebaseKey: string = `${import.meta.env.VITE_FIREBASE_KEY}` || "";
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: firebaseKey as string,
  authDomain: "mediamatchup-ac7a9.firebaseapp.com",
  projectId: "mediamatchup-ac7a9",
  storageBucket: "mediamatchup-ac7a9.appspot.com",
  messagingSenderId: "189212241219",
  appId: "1:189212241219:web:dde3668d395321834f53f6",
  measurementId: "G-F9N1XKCF6K",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const firebaseUI = new firebaseui.auth.AuthUI(auth);

export const googleAuthProvider = new GoogleAuthProvider();

export const signInWithGoogle = (): void => {
  signInWithPopup(auth, googleAuthProvider);
};
export const signOut = (): void => {
  auth.signOut();
};

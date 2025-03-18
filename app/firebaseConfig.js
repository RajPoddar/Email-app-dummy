// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps} from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendEmailVerification, signOut, onAuthStateChanged, sendPasswordResetEmail } from "firebase/auth";

import { getFirestore, doc, setDoc } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDAhsLLryjA7W-KBqZXIqmVU2p7i6XNGdU",
    authDomain: "email-marketing-app-e5722.firebaseapp.com",
    projectId: "email-marketing-app-e5722",
    storageBucket: "email-marketing-app-e5722.firebasestorage.app",
    messagingSenderId: "169714228318",
    appId: "1:169714228318:web:56547e62c6121b2e5828cf",
    measurementId: "G-QP7FG10K4S"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const db = getFirestore(app) //FireStore 

const auth = getAuth(app);

export { auth,db, setDoc, doc, app, getAuth, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendEmailVerification, signOut, onAuthStateChanged, sendPasswordResetEmail }; //Fire store auth
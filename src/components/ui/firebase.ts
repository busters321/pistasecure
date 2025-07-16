import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Correct Firebase config
const firebaseConfig = {
    apiKey: "AIzaSyDItGGp-Mn-XRUF0W80LVupQelYLpDrInk",
    authDomain: "pista-main.firebaseapp.com",
    projectId: "pista-main",
    storageBucket: "pista-main.firebasestorage.app",
    messagingSenderId: "488392069056",
    appId: "1:488392069056:web:77787a458404307f2dc225"
};

// Initialize once
let firebaseApp;

export const getFirebaseApp = () => {
    if (!firebaseApp) {
        firebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);
    }
    return firebaseApp;
};

export const auth = getAuth(getFirebaseApp());
export const db = getFirestore(getFirebaseApp());

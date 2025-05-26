import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyDItGGp-Mn-XRUF0W80LVupQelYLpDrInk",
    authDomain: "pista-main.firebaseapp.com",
    projectId: "pista-main",
    storageBucket: "pista-main.firebasestorage.app",
    messagingSenderId: "488392069056",
    appId: "1:488392069056:web:77787a458404307f2dc225"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };

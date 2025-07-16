import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, User } from "firebase/auth";
import {
    getFirestore,
    collection,
    addDoc,
    serverTimestamp,
    doc,
    onSnapshot,
    setDoc,
    getDoc
} from "firebase/firestore";

// Correct Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDItGGp-Mn-XRUF0W80LVupQelYLpDrInk",
    authDomain: "pista-main.firebaseapp.com",
    projectId: "pista-main",
    storageBucket: "pista-main.firebasestorage.app",
    messagingSenderId: "488392069056",
    appId: "1:488392069056:web:77787a458404307f2dc225"
};

// Singleton pattern for Firebase app
let firebaseApp;

const getFirebaseApp = () => {
    if (!firebaseApp) {
        firebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);
    }
    return firebaseApp;
};

const app = getFirebaseApp();

export const auth = getAuth(app);
export const db = getFirestore(app);

// Create user document
export const createUserDocument = async (user: User) => {
    const userRef = doc(db, "users", user.uid);

    await setDoc(
        userRef,
        {
            email: user.email,
            name: user.displayName || user.email?.split("@")[0] || "User",
            status: "active",
            subscription: {
                plan: "free",
                status: "inactive",
                stripeCustomerId: "",
                stripeSubscriptionId: ""
            },
            joined: serverTimestamp()
        },
        { merge: true }
    );
};

// Listen to subscription
export const listenToUserSubscription = (
    userId: string,
    callback: (subscription: any) => void
) => {
    const userRef = doc(db, "users", userId);
    return onSnapshot(userRef, (doc) => {
        if (doc.exists()) {
            callback(doc.data()?.subscription || {});
        }
    });
};

// Get user document
export const getUserDocument = async (userId: string) => {
    const userRef = doc(db, "users", userId);
    const docSnap = await getDoc(userRef);
    return docSnap.exists() ? docSnap.data() : null;
};

// Submit scam report
export const sendScamReport = async (reportData: {
    scamType: string;
    scamDetails: string;
    scamUrl: string;
    scamScreenshot?: string | null;
}) => {
    try {
        const user = auth.currentUser;
        if (!user) throw new Error("User not authenticated");

        const { scamType, scamDetails, scamUrl, scamScreenshot } = reportData;

        if (!scamType || !scamDetails || !scamUrl) {
            throw new Error("Missing required report fields");
        }

        const userDoc = await getUserDocument(user.uid);
        const isPro =
            userDoc?.subscription?.plan === "pro" &&
            userDoc?.subscription?.status === "active";

        const reportRef = collection(db, "scam_reports");

        await addDoc(reportRef, {
            uid: user.uid,
            email: user.email,
            scamType,
            scamDetails,
            scamUrl,
            scamScreenshot: scamScreenshot || null,
            status: "pending",
            isProReport: isPro,
            createdAt: serverTimestamp()
        });

        console.log("Scam report submitted successfully");
        return true;
    } catch (error) {
        console.error("Error submitting scam report:", error);
        throw error;
    }
};

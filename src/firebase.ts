import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCNEjOWKBCZ-EVnGV-NfHd2SCmGq5u9dPU",
    authDomain: "pistasecure.firebaseapp.com",
    projectId: "pistasecure",
    storageBucket: "pistasecure.appspot.com",
    messagingSenderId: "488392069056",
    appId: "1:488392069056:web:77787a458404307f2dc225"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];

const auth = getAuth(app);
const db = getFirestore(app);

const sendScamReport = async (reportData: {
    scamType: string;
    scamDetails: string;
    scamUrl: string;
    scamScreenshot?: string | null;
}) => {
    try {
        const user = auth.currentUser;

        if (!user) {
            console.error("User not authenticated");
            return;
        }

        const { scamType, scamDetails, scamUrl, scamScreenshot } = reportData;

        if (!scamType || !scamDetails || !scamUrl) {
            console.error("Missing required report fields");
            return;
        }

        const reportRef = collection(db, "scam_reports");

        await addDoc(reportRef, {
            uid: user.uid,
            email: user.email,
            scamType,
            scamDetails,
            scamUrl,
            scamScreenshot: scamScreenshot || null,
            status: "pending",
            createdAt: serverTimestamp()
        });

        console.log("Scam report submitted successfully");
    } catch (error) {
        console.error("Error submitting scam report:", error);
    }
};

export { auth, db, sendScamReport };

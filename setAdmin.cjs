const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const uid = "ouxy2oKlLeQUelk94UBcf1x2P7k1"; // Replace with target UID

admin.auth().setCustomUserClaims(uid, { admin: true })
    .then(() => {
        console.log(`Admin claim set for user ${uid}`);
    })
    .catch((error) => {
        console.error("Error setting admin claim:", error);
    });

import { ServiceAccount } from "firebase-admin";
import admin from "firebase-admin";

const serviceAccount: ServiceAccount = {
    projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
    privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
}

if (!admin.apps.length) {
    if (!serviceAccount.clientEmail ||
        !serviceAccount.privateKey ||
        !serviceAccount.projectId) {
        throw new Error("Missing Firebase admin credentials.");
    }

    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}

export default admin;

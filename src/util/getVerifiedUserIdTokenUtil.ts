import { NextRequest } from "next/server";
import admin from "@/server/firebaseAdmin";

export const getVerifiedUserIdTokenUtil = async (request: NextRequest) => {
    const authHeader = request.headers.get("authorization");
    const match = authHeader?.match(/^Bearer\s+(.+)$/i);

    if (!match) {
        return null;
    }

    const userIdToken = match[1];

    try {
        const verifiedUserIdToken = await admin.auth().verifyIdToken(userIdToken);
        return verifiedUserIdToken;
    } catch (error) {
        console.error(error);
        return null;
    }
}
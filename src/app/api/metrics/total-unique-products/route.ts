import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "../../db";
import { getVerifiedUserIdTokenUtil } from "@/util/getVerifiedUserIdTokenUtil";

export const GET = async (request: NextRequest) => {

    const verifiedUserIdToken = await getVerifiedUserIdTokenUtil(request);
    if (!verifiedUserIdToken) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { uid } = verifiedUserIdToken;

    try {
        const db = await connectToDB();
        const result = await db.collection("products").countDocuments({ userId: uid });
        const totalUniqueProducts = result;

        return NextResponse.json(totalUniqueProducts, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to get total unique products." }, { status: 500 });
    }
}
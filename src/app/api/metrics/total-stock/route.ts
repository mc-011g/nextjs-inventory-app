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
        const result = await db.collection("products").aggregate([
            { $match: { userId: uid } },
            {
                $group: {
                    _id: null,
                    totalStock: { $sum: { $ifNull: ["$quantity", 0] } }
                }
            },
            {
                $project: {
                    _id: 0,
                    totalStock: 1,
                }
            }
        ]).toArray();

        const totalStock = result[0]?.totalStock ?? 0;
        return NextResponse.json({ totalStock }, { status: 200 });
        
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to get low stock products." }, { status: 500 });
    }
}
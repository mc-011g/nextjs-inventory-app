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
        const result = await db.collection("orders").aggregate([
            { $match: { userId: uid } },
            { $sort: { dateAdded: 1 } },
            {
                $project: {
                    _id: 1,
                    customerName: 1,
                    dateAdded: 1,
                    lastUpdated: 1,
                    status: 1,
                    totalPrice: 1
                }
            },
            { $limit: 5 }
        ]).toArray();

        return NextResponse.json({ recentOrders: result }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to get low stock products." }, { status: 500 });
    }
}
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
            {
                $match: {
                    userId: uid,
                    $expr: { $lte: [{ $ifNull: ["$quantity", 0] }, 5] }
                }
            },
            {
                $addFields: {
                    categoryObjId: { $toObjectId: "$categoryId" }
                }
            },
            {
                $lookup: {
                    from: "categories",
                    localField: "categoryObjId",
                    foreignField: "_id",
                    as: "category"
                }
            },
            {
                $unwind: "$category"
            },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    categoryName: "$category.name",
                    quantity: 1
                }
            },
            { $sort: { quantity: 1 } },
            { $limit: 10 }
        ]).toArray();
  
        const lowStockProducts = result;

        return NextResponse.json(lowStockProducts, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to get low stock products." }, { status: 500 });
    }
}
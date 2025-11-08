import { NextRequest, NextResponse } from "next/server";
import { getVerifiedUserIdTokenUtil } from "@/util/getVerifiedUserIdTokenUtil";
import { connectToDB } from "../../db";

export const GET = async (request: NextRequest) => {

    const verifiedUserIdToken = await getVerifiedUserIdTokenUtil(request);
    if (!verifiedUserIdToken) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { uid } = verifiedUserIdToken;

    try {
        const db = await connectToDB();

        const result = await db.collection("orders").aggregate([
            { $match: { userId: uid, status: "Delivered" } },
            { $unwind: "$orderItems" },
            {
                $group: {
                    _id: "$orderItems.categoryId",
                    totalSales: { $sum: { $multiply: ["$orderItems.price", "$orderItems.quantityOrdered"] } }
                }
            },
            {
                $addFields: {
                    categoryObjId: { $toObjectId: "$_id" }
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
                    totalSales: 1,
                    categoryName: "$category.name"
                }
            },
            { $sort: { totalSales: -1 } },
            { $limit: 5 }
        ]).toArray();
 
        const topCategorySales = result;

        return NextResponse.json({ topCategorySales }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to get low stock products." }, { status: 500 });
    }
}
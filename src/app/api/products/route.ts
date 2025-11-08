import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "../db";
import { getVerifiedUserIdTokenUtil } from "@/util/getVerifiedUserIdTokenUtil";

export const GET = async (request: NextRequest) => {

    const verifiedUserIdToken = await getVerifiedUserIdTokenUtil(request);
    if (!verifiedUserIdToken) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { uid } = verifiedUserIdToken;

    try {
        const db = await connectToDB();
        const products = await db.collection("products").find({ userId: uid }).toArray();
        return NextResponse.json(products, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to get products." }, { status: 500 });
    }

}

export const POST = async (request: NextRequest) => {

    const verifiedUserIdToken = await getVerifiedUserIdTokenUtil(request);
    if (!verifiedUserIdToken) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { uid } = verifiedUserIdToken;

    try {
        const body = await request.json();
   
        if (!body ||
            typeof body.imageLink !== 'string' ||
            typeof body.name !== 'string' || body.name.length === 0 ||
            typeof body.categoryId !== 'string' ||
            typeof body.price !== 'number' ||
            typeof body.quantity !== 'number' ||
            typeof body.sku !== 'string'
        ) {
            return NextResponse.json({ error: 'Invalid product data. ' }, { status: 400 });
        }

        const bodyWithDateAdded = {
            imageLink: body.imageLink,
            name: body.name,
            price: body.price,
            categoryId: body.categoryId,
            quantity: body.quantity,
            sku: body.sku,
            userId: uid,
            dateAdded: new Date().toUTCString()
        };

        try {
            const db = await connectToDB();
            const result = await db.collection("products").insertOne(bodyWithDateAdded);

            if (!result.acknowledged) {
                return NextResponse.json({ error: "Failed to create product." }, { status: 400 });
            }

            const insertedProduct = await db.collection("products").aggregate([
                { $match: { _id: result.insertedId } },
                {
                    $addFields: {
                        categoryIdObj: { $toObjectId: "$categoryId" }
                    }
                },
                {
                    $lookup: {
                        from: "categories",
                        localField: "categoryIdObj",
                        foreignField: "_id",
                        as: "category"
                    }
                },
                { $unwind: "$category" },
                {
                    $project: {
                        _id: 1,
                        name: 1,
                        imageLink: 1,
                        price: 1,
                        quantity: 1,
                        sku: 1,
                        userId: 1,
                        dateAdded: 1,
                        categoryId: 1,
                        categoryName: "$category.name"
                    }
                }
            ]).toArray();

            if (!insertedProduct) {
                return NextResponse.json({ error: "Failed to create new product." }, { status: 400 });
            }

            return NextResponse.json(insertedProduct[0], { status: 201 });

        } catch (error) {
            console.error(error);
            return NextResponse.json({ error: "Failed to create new product." }, { status: 500 });
        }
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Invalid JSON data." }, { status: 400 });
    }
}
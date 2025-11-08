import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "../../db";
import { ObjectId } from "mongodb";
import { getVerifiedUserIdTokenUtil } from "@/util/getVerifiedUserIdTokenUtil";

export const GET = async (request: NextRequest, { params }: { params: { id: string } }) => {

    const verifiedUserIdToken = await getVerifiedUserIdTokenUtil(request);
    if (!verifiedUserIdToken) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { uid } = verifiedUserIdToken;
    const { id } = params;

    try {
        const db = await connectToDB();
        const result = await db.collection("products").findOne({ _id: new ObjectId(id), userId: uid });

        if (!result) {
            return NextResponse.json({ error: "Failed to get product " }, { status: 400 });
        }

        return NextResponse.json(result, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to get product " }, { status: 500 });
    }
}

export const PATCH = async (request: NextRequest, { params }: { params: { id: string } }) => {

    const verifiedUserIdToken = await getVerifiedUserIdTokenUtil(request);
    if (!verifiedUserIdToken) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;

    try {
        const body = await request.json();
        const { name, price, categoryId, imageLink, sku, quantity, userId } = body;

        if (!body ||
            typeof id !== 'string' ||
            typeof name !== 'string' ||
            typeof price !== 'number' ||
            typeof categoryId !== 'string' ||
            typeof quantity !== 'number' ||
            typeof sku !== 'string' ||
            typeof userId !== 'string' ||
            typeof imageLink !== 'string'
        ) {
            return NextResponse.json({ error: "Invalid product data" }, { status: 400 })
        }

        try {
            const db = await connectToDB();
            const result = await db.collection("products").findOneAndUpdate(
                { _id: new ObjectId(id) },
                { $set: { imageLink, name, price, categoryId, quantity, sku, lastUpdated: new Date().toUTCString() } },
                { returnDocument: "after" }
            );

            if (!result) {
                return NextResponse.json({ error: "Failed to create product." }, { status: 400 });
            }

            return NextResponse.json(result, { status: 200 });
        } catch (error) {
            console.error(error);
            return NextResponse.json({ error: "Failed to update product." }, { status: 500 });
        }
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Invalid JSON data." }, { status: 400 });
    }
}

export const DELETE = async (request: NextRequest, { params }: { params: { id: string } }) => {
    const verifiedUserIdToken = await getVerifiedUserIdTokenUtil(request);
    if (!verifiedUserIdToken) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;

    try {
        const db = await connectToDB();
        const result = await db.collection("products").deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount !== 1) {
            return NextResponse.json({ error: "Failed to delete product." }, { status: 400 });
        }

        return NextResponse.json(null, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Invalid JSON data." }, { status: 500 });
    }
}
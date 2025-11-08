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
        const categories = await db.collection("categories").find({ userId: uid }).toArray();
        return NextResponse.json(categories, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to get categories." }, { status: 500 });
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
            typeof body.name !== 'string' ||
            typeof body.description !== 'string'
        ) {
            return NextResponse.json({ error: "Invalid category data. " }, { status: 400 });
        }

        const newCategoryData = {
            name: body.name,
            description: body.description,
            userId: uid,
            dateAdded: new Date().toUTCString(),
        };

        try {
            const db = await connectToDB();
            const result = await db.collection("categories").insertOne(newCategoryData);

            if (!result.acknowledged) {
                return NextResponse.json({ error: "Failed to create category." }, { status: 500 });
            }

            return NextResponse.json({ ...newCategoryData, _id: String(result.insertedId) }, { status: 201 });
        } catch (error) {
            console.error(error);
            return NextResponse.json({ error: "Failed to create new category." }, { status: 500 });
        }

    } catch {
        return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
    }

}
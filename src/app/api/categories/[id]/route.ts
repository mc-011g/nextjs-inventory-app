import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "../../db";
import { ObjectId } from "mongodb";
import { getVerifiedUserIdTokenUtil } from "@/util/getVerifiedUserIdTokenUtil";

export const GET = async (request: NextRequest, { params }: { params: Promise<{ id: string }> }) => {

    const verifiedUserIdToken = await getVerifiedUserIdTokenUtil(request);
    if (!verifiedUserIdToken) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { uid } = verifiedUserIdToken;
    const { id } = await params;

    try {
        const db = await connectToDB();
        const result = await db.collection("categories").findOne({ _id: new ObjectId(id), userId: uid });

        if (!result) {
            return NextResponse.json({ error: "Failed to get category " }, { status: 404 });
        }

        return NextResponse.json(result, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to get category " }, { status: 500 });
    }
}

export const PATCH = async (request: NextRequest, { params }: { params: Promise<{ id: string }> }) => {

    const verifiedUserIdToken = await getVerifiedUserIdTokenUtil(request);
    if (!verifiedUserIdToken) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const body = await request.json();
    const { name, description } = body;

    if (!body ||
        typeof name !== 'string' ||
        typeof description !== 'string'
    ) {
        return NextResponse.json({ error: "Invalid category data. " }, { status: 400 });
    }

    try {
        const db = await connectToDB();
        const result = await db.collection("categories").findOneAndUpdate(
            { _id: new ObjectId(id) },
            { $set: { name, description, lastUpdated: new Date().toUTCString() } },
            { returnDocument: "after" }
        );

        if (!result) {
            return NextResponse.json({ error: "Failed to update category." }, { status: 500 });
        }

        return NextResponse.json(result, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to update category." }, { status: 500 });
    }
}

export const DELETE = async (request: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    const verifiedUserIdToken = await getVerifiedUserIdTokenUtil(request);
    if (!verifiedUserIdToken) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    try {
        const db = await connectToDB();
        const result = await db.collection("categories").deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount !== 1) {
            return NextResponse.json({ error: "Failed to delete category." }, { status: 500 });
        }

        return NextResponse.json(null, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to delete category." }, { status: 500 });
    }
}
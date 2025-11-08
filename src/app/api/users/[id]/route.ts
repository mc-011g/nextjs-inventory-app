import { ObjectId } from "mongodb";
import { connectToDB } from "../../db";
import { NextRequest, NextResponse } from "next/server";
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
        const categories = await db.collection("users").findOne({ _id: new ObjectId(id), userId: uid });

        return NextResponse.json(categories, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to get user data." }, { status: 500 });
    }
}

export const PATCH = async (request: NextRequest, { params }: { params: Promise<{ id: string }> }) => {

    const verifiedUserIdToken = await getVerifiedUserIdTokenUtil(request);
    if (!verifiedUserIdToken) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { uid } = verifiedUserIdToken;
    const { id } = await params;

    try {
        const body = await request.json();

        if (!body ||
            typeof body.email !== 'string' ||
            typeof body.firstName !== 'string' ||
            typeof body.lastName !== 'string'
        ) {
            return NextResponse.json({ error: "Invalid user data" }, { status: 400 })
        }

        try {
            const db = await connectToDB();
            const result = await db.collection("users").findOneAndUpdate(
                { _id: new ObjectId(id), userId: uid },
                {
                    $set: {
                        email: body.email,
                        firstName: body.firstName,
                        lastName: body.lastName
                    }
                },
                { returnDocument: "after" }
            );

            if (!result) {
                return NextResponse.json({ error: "Failed to update user." }, { status: 400 });
            }

            return NextResponse.json(result, { status: 200 });
        } catch (error) {
            console.error(error);
            return NextResponse.json({ error: "Failed to update user." }, { status: 500 });
        }
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Invalid JSON data." }, { status: 400 });
    }
}
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
        const userFoundResult = await db.collection("users").findOne({ firebaseUID: uid });

        if (!userFoundResult) {
            return NextResponse.json({ error: "Failed to get user profile data. " }, { status: 400 });
        }

        return NextResponse.json(userFoundResult, { status: 201 });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to get user profile data." }, { status: 500 });
    }
}

export const PATCH = async (request: NextRequest) => {

    const verifiedUserIdToken = await getVerifiedUserIdTokenUtil(request);
    if (!verifiedUserIdToken) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { uid } = verifiedUserIdToken;

    try {
        const body = await request.json();
        const { firstName, lastName } = body;

        if (!body ||
            typeof body.firstName !== 'string' ||
            typeof body.lastName !== 'string' ||
            (body.email && typeof body.email !== 'string')
        ) {
            return NextResponse.json({ error: 'Invalid profile data. ' }, { status: 400 });
        }

        try {
            const db = await connectToDB();
            const result = await db.collection("users").findOneAndUpdate({ firebaseUID: uid }, {
                $set: {
                    firstName,
                    lastName,
                    lastUpdated: new Date().toUTCString(),
                }
            }, { returnDocument: "after" }
            );

            if (!result) {
                return NextResponse.json({ error: "Failed to update profile." }, { status: 400 });
            }

            return NextResponse.json(result, { status: 200 });

        } catch (error) {
            console.error(error);
            return NextResponse.json({ error: "Failed to update profile." }, { status: 500 });
        }
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Invalid JSON data." }, { status: 400 });
    }
}
import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "../db";

export const POST = async (request: NextRequest) => {

    try {
        const body = await request.json();
        const { firebaseUID, email, firstName, lastName } = body;

        if (
            !email || typeof email !== "string" ||
            !firstName || typeof firstName !== "string" ||
            !lastName || typeof lastName !== "string" ||
            !firebaseUID || typeof firebaseUID !== "string"
        ) {
            return NextResponse.json({ error: "Missing or invalid user data" }, { status: 400 });
        }

        const db = await connectToDB();
        const userFoundResult = await db.collection("users").findOne({ firebaseUID });

        if (userFoundResult) {
            return NextResponse.json({ error: "User already exists. " }, { status: 400 });
        }

        const newUserData = {
            firebaseUID,
            email,
            firstName,
            lastName,
            createdAt: new Date(),
        }

        const result = await db.collection("users").insertOne(newUserData);
        return NextResponse.json({ ...newUserData, id: String(result.insertedId) }, { status: 201 });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to create user." }, { status: 500 });
    }
}
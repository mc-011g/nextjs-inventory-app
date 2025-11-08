import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "../db";
import { getVerifiedUserIdTokenUtil } from "@/util/getVerifiedUserIdTokenUtil";
import { OrderItem } from "@/types";

export const GET = async (request: NextRequest) => {
    const verifiedUserIdToken = await getVerifiedUserIdTokenUtil(request);
    if (!verifiedUserIdToken) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { uid } = verifiedUserIdToken;

    try {
        const db = await connectToDB();
        const orders = await db.collection("orders").find({ userId: uid }).toArray();

        return NextResponse.json(orders, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to get orders." }, { status: 500 });
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
        const { customerName, customerAddress, customerPhone, customerEmail, totalPrice, notes, orderItems } = body;

        if (!body ||
            typeof customerName !== 'string' ||
            typeof customerAddress !== 'string' ||
            typeof customerPhone !== 'string' ||
            typeof customerEmail !== 'string' ||
            typeof totalPrice !== 'number' ||
            typeof notes !== 'string'
        ) {
            return NextResponse.json({ error: "Invalid order data" }, { status: 400 })
        }

        for (const item of orderItems as OrderItem[]) {
            if (typeof item.id !== 'string' ||
                typeof item.name !== 'string' ||
                typeof item.imageLink !== 'string' ||
                typeof item.price !== 'number' ||
                typeof item.quantityOrdered !== 'number' ||
                typeof item.categoryId !== 'string'
            ) {
                return NextResponse.json({ error: "Invalid order data" }, { status: 400 })
            }
        }

        const newOrder = {
            customerName,
            customerAddress,
            customerPhone,
            customerEmail,
            totalPrice,
            notes,
            orderItems,
            userId: uid,
            dateAdded: new Date().toUTCString(),
            status: "Pending"
        };
    
        try {
            const db = await connectToDB(); 
            const result = await db.collection("orders").insertOne(newOrder);

            if (!result.acknowledged) {
                return NextResponse.json({ error: "Failed to create order." }, { status: 500 });
            }

            return NextResponse.json({ ...newOrder, _id: result.insertedId }, { status: 201 });
        } catch (error) {
            console.error(error);
            return NextResponse.json({ error: "Failed to create order." }, { status: 500 });
        }
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Invalid JSON data." }, { status: 400 });
    }
}
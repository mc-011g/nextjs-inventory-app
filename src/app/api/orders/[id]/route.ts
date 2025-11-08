import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "../../db";
import { ObjectId } from "mongodb";
import { Order, OrderItem } from "@/types";
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
        const result = await db.collection("orders").findOne({ _id: new ObjectId(id), userId: uid });

        if (!result) {
            return NextResponse.json({ error: "Failed to get order" }, { status: 400 });
        }

        return NextResponse.json(result, { status: 200 });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Invalid category data." }, { status: 500 });
    }
}

export const PATCH = async (request: NextRequest, { params }: { params: { id: string } }) => {

    const verifiedUserIdToken = await getVerifiedUserIdTokenUtil(request);
    if (!verifiedUserIdToken) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { uid } = verifiedUserIdToken;
    const { id } = params;

    try {
        const body = await request.json();
        const { customerName, customerEmail, notes, customerAddress, customerPhone, orderItems, totalPrice, status }: Order = body;

        if (!body ||
            typeof customerName !== 'string' ||
            typeof customerAddress !== 'string' ||
            typeof customerPhone !== 'string' ||
            typeof customerEmail !== 'string' ||
            typeof totalPrice !== 'number' ||
            typeof notes !== 'string'
        ) {
            return NextResponse.json({ error: "Invalid order data." }, { status: 400 });
        }

        for (const item of orderItems as OrderItem[]) {
            if (typeof item.id !== 'string' ||
                typeof item.name !== 'string' ||
                typeof item.imageLink !== 'string' ||
                typeof item.price !== 'number' ||
                typeof item.quantityOrdered !== 'number' ||
                typeof item.categoryId !== 'string'
            ) {
                return NextResponse.json({ error: "Invalid order data." }, { status: 400 });
            }
        }

        try {
            const db = await connectToDB();

            if (status === "Shipped" ||
                status === "Delivered"
            ) {
                const reduceQuantityPromises = orderItems.map(item => {
                    const quantityToReduce = item.quantityOrdered;

                    return db.collection("products").findOneAndUpdate(
                        { _id: new ObjectId(item.id), userId: uid, quantity: { $gte: quantityToReduce } },
                        { $inc: { quantity: -quantityToReduce } },
                        { returnDocument: "after" }
                    )
                });

                const reducedStockPromiseResults = await Promise.all(reduceQuantityPromises);
                const failedReducedStockResult = (reducedStockPromiseResults).find(result => !result?._id);
                if (failedReducedStockResult) {
                    return NextResponse.json({ error: "Failed to reduce stock on product." }, { status: 400 });
                }

            }

            const result = await db.collection("orders").findOneAndUpdate(
                { _id: new ObjectId(id), userId: uid },
                { $set: { customerName, customerEmail, customerAddress, customerPhone, orderItems, totalPrice, status, notes, lastUpdated: new Date().toUTCString() } },
                { returnDocument: "after" }
            );

            if (!result) {
                return NextResponse.json({ error: "Failed to create order." }, { status: 400 });
            }

            return NextResponse.json(result, { status: 200 });
        } catch (error) {
            console.error(error);
            return NextResponse.json({ error: "Failed to create order." }, { status: 500 });
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
    const { uid } = verifiedUserIdToken;
    const { id } = params;

    try {
        const db = await connectToDB();
        const result = await db.collection("orders").deleteOne({ _id: new ObjectId(id), userId: uid });

        if (result.deletedCount !== 1) {
            return NextResponse.json({ error: "Failed to delete order." }, { status: 500 });
        }

        return NextResponse.json(null, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to delete order." }, { status: 500 });
    }
}
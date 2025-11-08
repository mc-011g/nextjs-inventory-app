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
      { $group: { _id: null, totalSales: { $sum: "$totalPrice" } } },
    ]).toArray();

    const totalSales = result[0]?.totalSales || 0;

    return NextResponse.json(totalSales, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to get total sales." }, { status: 500 });
  }
}
import { requestGeneratedCards } from "@/lib/database";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req: NextRequest) {
    const userId = req.headers.get("X-User-Id");
    console.log("User id:", userId);
    if(userId) {
        const cards = await requestGeneratedCards(userId);
        return NextResponse.json(cards);
    } else {
        return NextResponse.json({status: 500});
    }
}
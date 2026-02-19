import { NextRequest, NextResponse } from "next/server";
import { getUserById, updateUserInDatabase } from "@/lib/database";

export async function GET(req: NextRequest) {
    const userId = req.headers.get("X-User-Id") as string;
    const gotUser = await getUserById(userId);
    
    return NextResponse.json(gotUser);
}

export async function POST(req: NextRequest) {
    const {id, params} = await req.json();
    await updateUserInDatabase(id, params);

    return NextResponse.json({status: 200});
}
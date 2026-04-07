import { NextRequest, NextResponse } from "next/server";
import { createNewLanguages, getUserById, updateUserInDatabase } from "@/lib/database";

export async function GET(req: NextRequest) {
    const userId = req.headers.get("X-User-Id") as string;
    const gotUser = await getUserById(userId);
    
    return NextResponse.json(gotUser);
}

export async function POST(req: NextRequest) {
    const { id, params } = await req.json();
    const { languages, ...restParams } = params;
    await updateUserInDatabase(id, restParams);
    await createNewLanguages(id, languages);

    return NextResponse.json({status: 200});
}
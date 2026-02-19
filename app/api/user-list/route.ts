import { getSpecificCategory } from "@/lib/database";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const { role, exceptCurrentUserId, select } = await req.json();
    const gotUsers = await getSpecificCategory(exceptCurrentUserId, role, select);

    return NextResponse.json(gotUsers);
}
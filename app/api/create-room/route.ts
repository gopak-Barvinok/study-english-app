import { createRoom, updateScheduleInDatabase } from "@/lib/database";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const { roomId, participants, slot } = await req.json();
    await createRoom(roomId, participants, slot);
    return NextResponse.json({status: "success"});
}
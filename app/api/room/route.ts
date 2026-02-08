import { joinToRoom, requestUsersByRoomId } from "@/lib/database";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const roomId = req.headers.get("X-Room-Id");
        const requestedRoomUsers = requestUsersByRoomId(roomId!);
        return NextResponse.json(requestedRoomUsers);
    } catch (e) {
        console.error(e);
        return NextResponse.json({status: 500, error: e});
    }
}

export async function POST(req: NextRequest) {
    try {
        const {
            roomId,
            partisipantsId,
            createdAt,
        } = await req.json();
        joinToRoom(roomId, JSON.stringify(partisipantsId), createdAt);
        return NextResponse.json({ status: 200 });
    } catch (e) {
        console.error(e);
        return NextResponse.json({status: 500, error: e});
    }
}
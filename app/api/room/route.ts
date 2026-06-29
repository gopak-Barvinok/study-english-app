import { createRoom, requestRoomParticipants } from "@/lib/database";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const roomId = req.headers.get("X-Room-Id") as string;
        const rooms = await requestRoomParticipants(roomId);
        const participants_id = rooms.flatMap((r) => r.participants.map((p) => p.id));
        return NextResponse.json({ participants_id });
    } catch (e) {
        console.error(e);
        return NextResponse.json({status: 500, error: e});
    }
}

export async function POST(req: NextRequest) {
    try {
        const {
            room_id,
            participants_id,
            created_at,
        } = await req.json();
        console.log("Room id:", room_id);
        await createRoom(
            room_id,
            participants_id,
            created_at
        );
        return NextResponse.json({ status: 200 });
    } catch (e) {
        console.error(e);
        return NextResponse.json({status: 500, error: e});
    }
}
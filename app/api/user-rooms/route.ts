import { getUserRooms } from "@/lib/database";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const userId = req.headers.get("X-User-Id");
  if (!userId) return NextResponse.json({ error: "No user id" }, { status: 400 });
  const rooms = await getUserRooms(userId);
  return NextResponse.json(rooms);
}

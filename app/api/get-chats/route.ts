import { getChats } from "@/lib/database";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req: NextRequest) {
    const userId = req.headers.get("X-User-Id");
    const chats = await getChats(userId!);
    console.log(chats);
    const ids = chats.map((chat: any) => chat.id as string);
    return NextResponse.json(ids);
}
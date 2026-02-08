//@ts-nocheck
import { requestLearnedWords } from "@/lib/database";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const { roomId } = await req.json();
    const gotWords = requestLearnedWords(roomId);
    return NextResponse.json(gotWords.learned_words);
}
// import { getLanguages } from "@/utils/server";
import { NextResponse } from "next/server";

export async function GET() {
    const languages = ["English", "Spanish", "French", "German"];
    return NextResponse.json(languages);
}
import { getTeacherFromDatabase } from "@/lib/database";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req: NextRequest) {
    const teacherId = req.headers.get("X-Teacher-Id");
    try {
        const teacher = await getTeacherFromDatabase(teacherId!);
        return NextResponse.json(teacher);
    } catch(e) {
        return NextResponse.json({error: e});
    }
}
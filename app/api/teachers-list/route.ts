import { requestTeachersList } from "@/lib/database";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const exceptCurrentUserId = req.headers.get("X-Current-User-Id");
    const gotTeachers = await requestTeachersList(exceptCurrentUserId!);

    return NextResponse.json(gotTeachers);
}
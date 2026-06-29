import { addTeacherRating } from "@/lib/database";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { teacherId, rating, comment } = await req.json();
  if (!teacherId || !rating) return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  await addTeacherRating(teacherId, rating, comment ?? "");
  return NextResponse.json({ status: "ok" });
}
import { db } from "@/lib/database";
import { User } from "@/types/user";
import { NextResponse } from "next/server";


export async function GET() {
    const statement = db.prepare(
        "SELECT * FROM users WHERE id != ? ORDER BY username ASC"
    );
    const users = statement.all("") as User[];
    return NextResponse.json({ users });
}
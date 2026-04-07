import {
    createCerteficatesInDatabase,
    createScheduleInDatabase,
    createTeacherInDatabase,
    getTeacherFromDatabase,
    updateCerteficatesInDatabase,
    updateScheduleInDatabase,
    updateTeacherInDatabase
} from "@/lib/database";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const id = req.headers.get("X-Teacher-Id");
    const teacher = await getTeacherFromDatabase(id!);

    return NextResponse.json(teacher);
}

export async function POST(req: NextRequest) {
    try {
        const { operation, certificates, schedule, ...data } = await req.json();
        console.log(operation);
        console.log(data);
        console.log(schedule);
        switch (operation) {
            case "create":
                await createTeacherInDatabase(data);
                await createCerteficatesInDatabase(data.id, certificates);
                await createScheduleInDatabase(data.id, schedule);
                break;
            case "update":
                await updateTeacherInDatabase(data.id, data);
                await updateCerteficatesInDatabase(data.id, certificates);
                await updateScheduleInDatabase(data.id, schedule);
                break;
        };

        return NextResponse.json({ status: 200 });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: e });
    }
}
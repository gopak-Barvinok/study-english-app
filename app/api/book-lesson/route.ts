import { createChat, createRoom, createScheduleInDatabase } from "@/lib/database";
import { NextRequest, NextResponse } from "next/server";
import { StreamChat } from "stream-chat";

const serverClient = StreamChat.getInstance(
    process.env.NEXT_PUBLIC_STREAM_API_KEY!,
    process.env.STREAM_SECRET!
);

const url = process.env.NEXT_PUBLIC_NEXTAUTH_URL!;

export async function POST(req: NextRequest) {
    const { studentId, teacherId, schedule } = await req.json();

    try {
        console.log(schedule);
        await createScheduleInDatabase(studentId, schedule);
        const channelId = crypto.randomUUID();
        console.log(channelId);
        const channel = serverClient.channel("messaging", channelId, {
            members: [studentId, teacherId],
            created_by_id: studentId,
        });
        await createChat([studentId, teacherId], channelId);
        const generatedRoomId = crypto.randomUUID();
        console.log("Sending message to channel:", channel.id);
        console.log("studentId:", studentId);
        await channel.create();
        await channel.sendMessage({
            text: `Hello! I am proposing a lesson on ${schedule[0]}. If you agree, please follow the special link below:\n${url}/app/create-lesson/${channelId}/${studentId}/${generatedRoomId}/${schedule[0]}`,
            user_id: studentId,
        });
        console.log("Message sent");
        return NextResponse.json({ status: 200 });
    } catch (e) {
        console.error("Error:", e);
        return NextResponse.json({ error: String(e) });
    }

}
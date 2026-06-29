import { createChat, createScheduleInDatabase, findChatBetweenUsers } from "@/lib/database";
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
        await createScheduleInDatabase(studentId, schedule);

        const existingChat = await findChatBetweenUsers(studentId, teacherId);
        let channelId: string;

        if (existingChat) {
            channelId = existingChat.id;
        } else {
            channelId = crypto.randomUUID();
            const newChannel = serverClient.channel("messaging", channelId, {
                members: [studentId, teacherId],
                created_by_id: studentId,
            });
            await newChannel.create();
            await createChat([studentId, teacherId], channelId);
        }

        const generatedRoomId = crypto.randomUUID();
        const channel = serverClient.channel("messaging", channelId);
        await channel.sendMessage({
            text: `Hello! I am proposing a lesson on ${schedule[0]}. If you agree, please follow the special link below:\n${url}/app/create-lesson/${channelId}/${studentId}/${generatedRoomId}/${encodeURIComponent(schedule[0])}`,
            user_id: studentId,
        });

        return NextResponse.json({ status: 200 });
    } catch (e) {
        console.error("Error:", e);
        return NextResponse.json({ error: String(e) });
    }
}

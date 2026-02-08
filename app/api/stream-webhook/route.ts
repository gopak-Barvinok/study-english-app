import { insertLearnedWords, updateRoomIds } from "@/lib/database";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const event = await req.json();
        const roomId = event.call_cid.replace("default:", "");

        switch (event.type) {
            case 'call.session_started':
                console.log("Session started:", event);
                break;
            case 'call.session_ended':
                console.log("Session ended:", event);
                break;
            case 'call.session_participant_joined':
                console.log("Participant joined:", event.participant.user.id);
                const roomIdsArr = [];
                roomIdsArr.push(roomId);
                updateRoomIds(JSON.stringify(roomIdsArr), event.participant.user.id);
                break;
            case 'call.transcription_started':
                console.log("Transcription started");
                break;
            case 'call.transcription_stopped':
                console.log("Transcription stopped:", event);
                break;
            case 'call.transcription_ready':
                console.log("Transcription ready:", event);
                const transcriptionUrl = event.call_transcription?.url;
                console.log("Transcription url:", transcriptionUrl);
                const request = await fetch(transcriptionUrl);
                const text = await request.text();
                const words: string[] = text
                    .split('\n')
                    .filter(Boolean)
                    .map(line => JSON.parse(line))
                    .map(item => item.text)
                    .join(' ')
                    .replace(/[.,!?;:"()\-]/g, ' ')
                    .toLowerCase()
                    .split(/\s+/)
                    .filter(word => word.length > 0);
                const uniqueWords = [...new Set(words)];
                console.log("Parsed transcription segments:", uniqueWords);
                insertLearnedWords(roomId, JSON.stringify(uniqueWords));
                break;
            case 'call.transcription_failed':
                console.log("Transcription failed", event);
                break;
        }
        return NextResponse.json({ status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ status: 500, error: error });
    }
}
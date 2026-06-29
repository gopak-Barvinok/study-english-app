import {
    createAndUpdateMessages,
    updateTranscribation,
    inputGeneratedCards,
} from "@/lib/database";
import { generateFlashCards } from "@/lib/groq";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const event = await req.json();
        const roomId = event.call_cid.replace("default:", "");

        switch (event.type) {
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
                const textData = await request.text();
                console.log("Text:", textData);

                const lines = textData
                    .split("\n")
                    .filter(line => line.trim() !== '');
                    
                const sentences = lines.map(line => {
                    try {
                        const parsedLine = JSON.parse(line);
                        return parsedLine.text;
                    } catch (e) {
                        console.warn('Failed parse the line:', line, e);
                        return null;
                    }
                }).filter(text => text !== null);

                console.log("Parsed transcription segments:", sentences);
                await updateTranscribation(roomId, sentences);
                
                if(sentences.length === 0) break;

                const cardsData = await generateFlashCards(sentences) as any[];
                await inputGeneratedCards(roomId, cardsData);
                break;
            case 'call.transcription_failed':
                console.log("Transcription failed", event);
                break;
            case 'message.new':
                const { message, channelId } = event;
                const dataInput = {
                    id: message.id,
                    text: message.text,
                    chatId: channelId,
                    senderId: message.user.id,
                    createdAt: new Date(message.created_at),
                };
                await createAndUpdateMessages(dataInput);
                break;
        }
        return NextResponse.json({ status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ status: 500, error: error });
    }
}
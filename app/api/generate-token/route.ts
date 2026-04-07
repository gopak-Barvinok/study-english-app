import { NextRequest, NextResponse } from 'next/server';
import { StreamClient } from "@stream-io/node-sdk";

export async function POST(req: NextRequest) {
    try {
        const { userId } = await req.json();

        if (!userId) {
            return NextResponse.json(
                { error: 'User ID is required' },
                { status: 400 }
            );
        }

        const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY!;
        const apiSecret = process.env.STREAM_SECRET!;

        if (!apiKey || !apiSecret) {
            throw new Error('Stream credentials are not configured');
        }

        const serverClient = new StreamClient(apiKey, apiSecret);
        const expirationTime = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7;

        const token = serverClient.generateUserToken({ user_id: userId, validity_in_seconds: expirationTime });

        return NextResponse.json({
            token,
            apiKey
        });
    } catch (e) {
        console.error('Error generating token:', e);
        return NextResponse.json(
            { error: 'Failed to generate token' },
            { status: 500 }
        );
    }
}

export const runtime = 'nodejs';
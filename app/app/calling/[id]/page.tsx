"use client";

import "@stream-io/video-react-sdk/dist/css/styles.css";
import Loading from "@/components/procedures/Loading";
import {
  useStreamVideoClient,
  Call,
  StreamCall,
  StreamTheme,
  CallingState,
} from "@stream-io/video-react-sdk";
import { useParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import VideoStatesHandler from "@/components/procedures/VideoStatesHandler";
import { fetchGet } from "@/utils/utils";

export default function CallingPage() {
  const params = useParams();
  const callId = params.id as string;
  const client = useStreamVideoClient();
  const [call, setCall] = useState<Call | null>(null);
  const callRef = useRef<Call | null>(null);

  useEffect(() => {
    if (!client) return;

    const initCall = async () => {
      const myCall = client.call("default", callId);

      try {
        const members = await fetchGet("/api/room", {
          "X-Room-Id": callId,
        });
        const parsedMembers = members.participants_id;

        if (!Array.isArray(parsedMembers) || parsedMembers.length === 0) {
          throw new Error("Invalid or empty participants list");
        }

        const memberObjects = parsedMembers.map((userId: string) => ({
          user_id: userId,
        }));

        try {
          if (myCall) {
            await myCall.getOrCreate({
              data: {
                members: memberObjects,
              },
            });
          }
        } catch (innerError) {
          console.log("Ignoring call creation error:", innerError);
        }

        setCall(myCall);
        callRef.current = myCall;
      } catch (e) {
        console.error("Failed to initialize call:", e);
        setCall(null);
        callRef.current = null;
      }
    };

    initCall();

    return () => {
      const currentCall = callRef.current;
      if (currentCall) {
        const callState = currentCall.state.callingState;
        if (
          callState !== CallingState.LEFT &&
          callState !== CallingState.RECONNECTING_FAILED
        ) {
          currentCall
            .leave()
            .catch(() => {});
        }
      }
      setCall(null);
      callRef.current = null;
    };
  }, [client, callId]);

  if (!call) return <Loading />;

  return (
    <StreamTheme>
      <StreamCall call={call}>
        <VideoStatesHandler />
      </StreamCall>
    </StreamTheme>
  );
}

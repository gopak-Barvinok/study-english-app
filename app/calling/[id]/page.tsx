"use client";

import Loading from "@/components/procedures/Loading";
import MyUILayout from "@/components/UILayout";
import { useRoomStore } from "@/store/userStore";
import {
  useStreamVideoClient,
  Call,
  StreamTheme,
  StreamCall,
} from "@stream-io/video-react-sdk";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";

export default function CallingPage() {
  const params = useParams();
  const { data: session, update } = useSession();
  const callId = params.id as string;
  const client = useStreamVideoClient();
  const [call, setCall] = useState<Call | null>(null);
  const setRoom = useRoomStore((state) => state.setRoom);
  const isInitializedRef = useRef(false);

  useEffect(() => {
    if (isInitializedRef.current || !client) return;
    isInitializedRef.current = true;

    const initCall = async () => {
      try {
        const myCall = client.call("default", callId);
        const response = await fetch("/api/room", {
          method: "GET",
          headers: {
            Accept: "application/json",
            "X-Room-Id": callId,
          },
        });
        const members = await response.json();
        const parsedMemders = JSON.parse(members.participants_id);
        const memberObjects = parsedMemders.map((userId: string) => ({
          user_id: userId,
        }));

        myCall
          .join({
            create: true,
            data: {
              members: memberObjects,
              settings_override: {
                transcription: {
                  mode: "auto-on",
                  language: "en",
                },
              },
            },
          })
          .catch(console.error);

        myCall.on("call.session_participant_joined", async (event) => {
          if (session?.user) {
            update({
              user: {
                ...session.user,
                roomIds: [
                  //@ts-ignore
                  ...(session.user.roomIds || []),
                  event.call_cid.replace("default:", ""),
                ],
              },
            });
          }
        });

        setRoom(callId);
        setCall(myCall);
      } catch (error) {
        console.error("Error initializing call:", error);
      }
    };

    initCall();

    return () => {
      if (call) {
        try {
          call.stopTranscription().catch(() => {});
        } catch (e) {}
        call.leave().catch(() => {});
      }
      setCall(null);
      isInitializedRef.current = false;
    };
  }, [client, callId, setRoom]);

  if (!call) return <Loading />;

  return (
    // <div className="flex flex-col">
    // </div>
    <StreamTheme>
      <StreamCall call={call}>
        <MyUILayout callId={callId} />
      </StreamCall>
    </StreamTheme>
  );
}

// {
//     "type": "call.session_participant_joined",
//     "created_at": "2026-02-08T17:56:59.954267062Z",
//     "call_cid": "default:f495395c-280c-42e8-bdae-d8f06c191119",
//     "session_id": "b7316991-aa69-4f91-8020-0265f8d8e61e",
//     "participant": {
//         "user": {
//             "id": "101111610803722131393",
//             "name": "klivlend",
//             "custom": {},
//             "language": "",
//             "role": "user",
//             "teams": [],
//             "created_at": "2026-02-05T13:20:14.363298Z",
//             "updated_at": "2026-02-05T13:20:14.36517Z",
//             "banned": false,
//             "online": true,
//             "blocked_user_ids": []
//         },
//         "user_session_id": "d88f5744-a896-4813-93e2-9df8b0015ac8",
//         "role": "user",
//         "joined_at": "2026-02-08T17:56:59.678Z"
//     },
//     "received_at": "2026-02-08T17:56:59.586Z"
// }

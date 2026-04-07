"use client";

import { useUserStore } from "@/store/userStore";
import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { fetchPost } from "@/utils/utils";
import { useChatContext } from "stream-chat-react";
import Loading from "@/components/procedures/Loading";

const url = process.env.NEXT_PUBLIC_NEXTAUTH_URL;

export default function CreateLesson() {
  const { user } = useUserStore();
  const { client } = useChatContext();
  const { chatId, studentId, roomId, slot } = useParams();
  const [status, setStatus] = useState<"success" | "fail" | "loading">(
    "loading",
  );
  const initialized = useRef(false);

  useEffect(() => {
    if (!user || user.id === studentId || initialized.current) return;
    initialized.current = true;

    fetchPost("/api/create-room", {
      roomId: roomId,
      participants: [studentId, user.id],
      schedule: slot,
    }).then((r) => {
      setStatus(r.status);
      if (r.status === "success") {
        const channel = client.channel("messaging", chatId);
        channel.sendMessage({
          text: `I agree to teach a lesson with you on the date you specified. Here is the link to the room:\n${url}/app/calling/${roomId}`,
          user_id: user.id,
        });
      }
    });
  }, [user?.id]);

  return (
    <div>
      {status === "loading" && <Loading />}
      {status === "success" && (
        <div>
          <p>
            You have successfully agreed to conduct the lesson. The response has
            been sent to your student in chat.
          </p>
        </div>
      )}
      {status === "fail" && <div>Error</div>}
    </div>
  );
}

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
  const { chatId, studentId, roomId, schedule } = useParams();
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
      slot: decodeURIComponent(schedule as string),
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

  if (status === "loading") return <Loading />;

  return (
    <div className="flex-1 flex flex-col items-center justify-center animate-fade-in">
      <div className="bg-base-200 border border-base-300 rounded-2xl shadow-xl w-96 p-8 flex flex-col items-center gap-5 text-center">
        {status === "success" ? (
          <>
            <div className="w-16 h-16 rounded-xl bg-success/15 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="space-y-1.5">
              <h2 className="text-lg font-semibold text-base-content">Lesson confirmed</h2>
              <p className="text-sm text-base-content/60">
                You have successfully agreed to conduct the lesson. The room link has been sent to your student in chat.
              </p>
            </div>
            <a
              href="/app/chats"
              className="btn btn-primary w-full rounded-xl hover:-translate-y-0.5 transition-transform duration-200"
            >
              Go to chats
            </a>
          </>
        ) : (
          <>
            <div className="w-16 h-16 rounded-xl bg-error/15 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-error" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <div className="space-y-1.5">
              <h2 className="text-lg font-semibold text-base-content">Something went wrong</h2>
              <p className="text-sm text-base-content/60">Failed to confirm the lesson. Please try again.</p>
            </div>
            <a
              href="/app/teachers-list"
              className="btn btn-ghost w-full rounded-xl hover:-translate-y-0.5 transition-transform duration-200"
            >
              Back to teachers
            </a>
          </>
        )}
      </div>
    </div>
  );
}

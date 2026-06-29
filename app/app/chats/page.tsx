"use client";

import {
  Channel,
  ChannelHeader,
  ChannelList,
  MessageList,
  MessageInput,
  Window,
  useChatContext,
} from "stream-chat-react";
import { useUserStore } from "@/store/userStore";
import "stream-chat-react/dist/css/v2/index.css";
import { useEffect, useState } from "react";
import { fetchGet } from "@/utils/utils";

export default function Chats() {
  const { client, channel: activeChannel } = useChatContext();
  const { user } = useUserStore();
  const [chatIds, setChatIds] = useState<string[]>();

  useEffect(() => {
    if (user) {
      fetchGet("/api/get-chats", {
        "X-User-Id": user.id,
      }).then((ids) => {
        setChatIds(ids);
      });
    }
  }, [user]);

  if (!user || !client) return null;

  if (!chatIds || chatIds.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-3 text-base-content/40 animate-fade-in">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        <p className="text-sm">No conversations yet</p>
        <p className="text-xs">Book a lesson to start chatting with a teacher</p>
      </div>
    );
  }

  return (
    <div className="flex w-full h-full max-w-5xl bg-base-200 border border-base-300 rounded-2xl overflow-hidden shadow-xl animate-fade-in mx-auto">
      {/* Sidebar */}
      <div className="w-64 shrink-0 border-r border-base-300 flex flex-col">
        <div className="px-4 py-3 border-b border-base-300">
          <h2 className="text-sm font-semibold text-base-content/60 uppercase tracking-wider">
            Messages
          </h2>
        </div>
        <div className="flex-1 overflow-y-auto">
          <ChannelList
            filters={{ id: { $in: chatIds }, type: "messaging" }}
            sort={{ last_message_at: -1 as const }}
            Preview={(props) => {
              const companion =
                props.channel.state.members[
                  Object.keys(props.channel.state.members).find(
                    (id) => id !== client.userID,
                  )!
                ];

              const isActive = activeChannel?.id === props.channel.id;

              return (
                <div
                  onClick={() => props.setActiveChannel?.(props.channel)}
                  className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors duration-150 border-b border-base-300/40 ${
                    isActive
                      ? "bg-primary/15 border-l-2 border-l-primary"
                      : "hover:bg-base-300/40"
                  }`}
                >
                  <img
                    src={companion?.user?.image ?? "/default-avatar.png"}
                    alt="avatar"
                    className="w-9 h-9 rounded-full object-cover ring-1 ring-base-300 shrink-0"
                  />
                  <span className={`text-sm font-medium truncate ${isActive ? "text-primary" : "text-base-content"}`}>
                    {companion?.user?.name ?? "Unknown"}
                  </span>
                </div>
              );
            }}
          />
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Channel>
          <Window>
            <ChannelHeader
              Avatar={() => {
                const companion = Object.values(
                  activeChannel?.state.members ?? {},
                ).find((m) => m.user?.id !== client.userID);

                return (
                  <img
                    src={companion?.user?.image ?? "/default-avatar.png"}
                    alt="avatar"
                    className="w-9 h-9 rounded-full object-cover"
                  />
                );
              }}
            />
            <MessageList />
            <MessageInput />
          </Window>
        </Channel>
      </div>
    </div>
  );
}

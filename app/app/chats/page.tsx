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

  return (
    <div>
      {chatIds && chatIds?.length > 0 && (
        <div style={{ display: "flex" }}>
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

              return (
                <div onClick={() => props.setActiveChannel?.(props.channel)}>
                  <img
                    src={companion?.user?.image ?? "/default-avatar.png"}
                    alt="avatar"
                    style={{ width: 40, height: 40, borderRadius: "50%" }}
                  />
                  <span>{companion?.user?.name}</span>
                </div>
              );
            }}
          />
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
                      style={{ width: 40, height: 40, borderRadius: "50%" }}
                    />
                  );
                }}
              />
              <MessageList />
              <MessageInput />
            </Window>
          </Channel>
        </div>
      )}
    </div>
  );
}

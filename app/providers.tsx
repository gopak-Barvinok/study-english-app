"use client";

import { useUserStore } from "@/store/userStore";
import { SessionProvider } from "next-auth/react";
import { StreamVideoClient, StreamVideo } from "@stream-io/video-react-sdk";
import { StreamChat } from "stream-chat";
import { useEffect, useState, type ReactNode } from "react";
import { fetchPost } from "@/utils/utils";
import { useSession } from "next-auth/react";
import { Chat } from "stream-chat-react";

type Props = {
  children: ReactNode;
};

const UserSessionSync = () => {
  const { data: session } = useSession();
  const loadUser = useUserStore((state) => state.loadUser);
  const user = useUserStore((state) => state.user);

  useEffect(() => {
    if (session?.user.id) {
      console.log("Session User:", session.user);
      loadUser(session.user.id).then(() => {
        console.log("User in store:", user);
      });
    }
  }, [session, loadUser]);

  return null;
};

const StreamProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useUserStore();
  const [videoClient, setVideoClient] = useState<StreamVideoClient | null>(
    null,
  );
  const [chatClient] = useState(() =>
    StreamChat.getInstance(process.env.NEXT_PUBLIC_STREAM_API_KEY!),
  );
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const initClient = async () => {
      console.log(user);
      if (!user) return;

      try {
        const { apiKey, token } = await fetchPost("/api/generate-token", {
          userId: user.id,
        });

        const newClient = new StreamVideoClient({
          apiKey,
          user: {
            id: user.id,
            name: user.name,
          },
          token,
        });

        await chatClient.connectUser(
          {
            id: user.id,
            name: user.name ?? undefined,
          },
          token,
        );

        setVideoClient(newClient);
        setReady(true);
      } catch (error) {
        console.error("Failed to initialize Stream client:", error);
      }
    };

    initClient();

    return () => {
      videoClient
        ?.disconnectUser()
        .catch((err) =>
          console.error("Failed to initialize the video client:", err),
        );
      chatClient
        .disconnectUser()
        .catch((err) =>
          console.error("Failed to initialize the chat client:", err),
        );
      setVideoClient(null);
      setReady(false);
    };
  }, [user?.id]);

  return (
    <StreamVideo client={videoClient!}>
      <Chat client={chatClient}>{children}</Chat>
    </StreamVideo>
  );
};

export default function Providers({ children }: Props) {
  return (
    <SessionProvider>
      <StreamProvider>
        <UserSessionSync />
        {children}
      </StreamProvider>
    </SessionProvider>
  );
}

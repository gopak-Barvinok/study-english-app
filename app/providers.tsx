"use client";

import { useUserStore } from "@/store/userStore";
import { SessionProvider, useSession } from "next-auth/react";
import {
  StreamVideoClient,
  StreamVideo,
  User as StreamUser,
} from "@stream-io/video-react-sdk";
import { useEffect, useState, type ReactNode } from "react";
import { User } from "@/types/user";

type Props = {
  children: ReactNode;
};

const SessionSync = () => {
  const { data: session } = useSession();
  const setUser = useUserStore((state) => state.setUser);
  useEffect(() => {
    if (session?.user) {
      setUser(session.user as User);
    } else {
      setUser(null);
    }
  }, [session, setUser]);

  return null;
};

const StreamVideoProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useUserStore();
  const [client, setClient] = useState<StreamVideoClient | null>(null);

  useEffect(() => {
    const initClient = async () => {
      console.log(user);
      if (!user) return;

      try {
        const response = await fetch("/api/generate-token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user.userId }),
        });

        if (!response.ok) throw new Error("Token generation failed");

        const { apiKey, token } = await response.json();
        const newClient = new StreamVideoClient({
          apiKey,
          user: {
            id: user.userId,
            name: user.name,
          } as StreamUser,
          token,
        });

        setClient(newClient);
      } catch (error) {
        console.error("Failed to initialize Stream client:", error);
      }
    };

    initClient();

    return () => {
      client?.disconnectUser();
      setClient(null);
    };
  }, [user?.userId]);

  return <StreamVideo client={client!}>{children}</StreamVideo>;
};

export default function Providers({ children }: Props) {
  return (
    <SessionProvider>
      <StreamVideoProvider>
        <SessionSync />
        {children}
      </StreamVideoProvider>
    </SessionProvider>
  );
}

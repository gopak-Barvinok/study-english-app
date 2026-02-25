"use client";

import { useUserStore } from "@/store/userStore";
import { SessionProvider } from "next-auth/react";
import {
  StreamVideoClient,
  StreamVideo,
  User as StreamUser,
} from "@stream-io/video-react-sdk";
import { useEffect, useState, type ReactNode } from "react";
import { fetchPost } from "@/utils/utils";
import { useSession } from "next-auth/react";

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

const StreamVideoProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useUserStore();
  const [client, setClient] = useState<StreamVideoClient | null>(null);

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
      client
        ?.disconnectUser()
        .catch((err) => console.error("Failed to initialize the client:", err));
      setClient(null);
    };
  }, [user?.id]);

  return <StreamVideo client={client!}>{children}</StreamVideo>;
};

export default function Providers({ children }: Props) {
  return (
    <SessionProvider>
      <StreamVideoProvider>
        <UserSessionSync />
        {children}
      </StreamVideoProvider>
    </SessionProvider>
  );
}

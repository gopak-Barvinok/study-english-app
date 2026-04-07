"use client";

import LoginWithGoogle from "@/components/buttons/loginButtons/LoginWithGoogle";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.push("/app");
    }
  }, [session]);

  return <LoginWithGoogle />;
}

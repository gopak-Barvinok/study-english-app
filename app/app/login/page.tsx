"use client";

import LoginWithGoogle from "@/components/buttons/loginButtons/LoginWithGoogle";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) router.push("/app");
  }, [session]);

  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-8 animate-fade-in">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-primary">StudyApp</h1>
        <p className="text-base-content/55">Sign in to continue learning</p>
      </div>

      <div className="bg-base-200 border border-base-300 rounded-2xl p-8 shadow-xl flex flex-col items-center gap-5 w-80">
        <p className="text-base-content/70 text-sm text-center">
          Connect with your Google account to get started
        </p>
        <LoginWithGoogle />
      </div>
    </div>
  );
}

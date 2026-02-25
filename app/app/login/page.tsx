"use client";

import LoginWithGoogle from "@/components/buttons/loginButtons/LoginWithGoogle";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export default function LoginPage() {
  const { data: session } = useSession();
  
  if (session) {
    return redirect("/app");
  }
  
  return <LoginWithGoogle/>;
}

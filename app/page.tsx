"use client";

import HomeComponent from "@/components/HomeComponent";
import { useUserStore } from "@/store/userStore";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export default function Home() {
  const { data: session } = useSession();
  const { user } = useUserStore();

  if(!session) {
    redirect("/login");
  }
  
  if (!user?.languages || user.languages.length === 0) {
    redirect("/set-user-params");
  }
  
  return <HomeComponent/>
}

"use client";

import { useSession } from "next-auth/react";
import { useUserStore } from "@/store/userStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import HomeComponent from "@/components/HomeComponent";

export default function AppPage() {
  const { user } = useUserStore();
  const router = useRouter();

  useEffect(() => {
    if(!user) return;
    if (
      !user?.languages ||
      user.languages.length === 0 ||
      !user.location ||
      !user.timezone ||
      !user.age
    ) {
      router.push("/app/set-user-params");
    }
  }, [user]);


  return <HomeComponent />;
}

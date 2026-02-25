"use client";

import { useSession } from "next-auth/react";
import { useUserStore } from "@/store/userStore";
import { redirect } from "next/navigation";
import HomeComponent from "@/components/HomeComponent";

export default function AppPage() {
    const { data: session } = useSession();
    const { user } = useUserStore();
    
    if(!session) {
      return redirect("/app/login");
    }
    
    if (!user?.languages || user.languages.length === 0) {
      return redirect("/app/set-user-params");
    }
    
    return <HomeComponent/>

}


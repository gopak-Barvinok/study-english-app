"use client";

import { useSession } from "next-auth/react";
import TabBar from "./TabBar";
import { useRoomStore, useUserStore } from "@/store/userStore";
import { usePathname } from "next/navigation";

export default function TabBarWrapper() {
    const { data: session } = useSession();
    const { user } = useUserStore();
    const { room } = useRoomStore();
    const pathName = usePathname();

    if(!session) return null;

    if (
        !user?.languages 
        || 
        user.languages.length === 0 
        || 
        pathName === `/calling/${room}`
        ||
        !user?.role
    ) return null;

    return <TabBar/>
}
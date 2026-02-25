"use client";

import { useSession } from "next-auth/react";
import TabBar from "./TabBar";
import { usePathname } from "next/navigation";
import LendingFooter from "./LendingFooter";

export default function FooterWrapper() {
  const { data: session } = useSession();
  const pathName = usePathname();

  if (
    !session ||
    pathName === "/app/login" ||
    pathName === "/app/set-user-params" ||
    pathName.startsWith("/app/calling/")
  )
    return null;

  if (pathName === "/") return <LendingFooter />;

  return <TabBar />;
}

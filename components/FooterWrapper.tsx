"use client";

import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { classNameFooter } from "@/lib/classNames";

export default function FooterWrapper() {
  const { data: session } = useSession();
  const pathName = usePathname();

  if (
    !session ||
    pathName !== "/"
  )
    return null;

  return (
      <aside className={classNameFooter}>
        <p>
          Copyright © {new Date().getFullYear()} - All right reserved by StudyApp
          Industries Ltd
        </p>
      </aside>
  );
}

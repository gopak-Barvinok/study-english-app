"use client";

import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";

export default function FooterWrapper() {
  const { data: session } = useSession();
  const pathName = usePathname();

  if (!session || pathName !== "/") return null;

  return (
    <footer className="py-6 px-8 bg-base-200 border-t border-base-300 text-center text-base-content/40 text-sm">
      © {new Date().getFullYear()} StudyApp — All rights reserved
    </footer>
  );
}

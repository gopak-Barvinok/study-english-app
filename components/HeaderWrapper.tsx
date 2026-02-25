"use client";

import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";

export default function HeaderWrapper() {
  const { data: session } = useSession();
  const pathName = usePathname();

  if (
    !session ||
    pathName === "/app/login" ||
    pathName === "/app/set-user-params" ||
    pathName.startsWith("/app/calling/")
  )
    return null;

  return (
    <div className="navbar bg-base-100 shadow-sm">
      <div className="flex-1">
        <a className="btn btn-ghost text-xl">StudyApp</a>
      </div>
      <div className="flex-none">
        <button className="btn btn-square btn-ghost">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            className="inline-block h-5 w-5 stroke-current"
          >
            {" "}
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
            ></path>{" "}
          </svg>
        </button>
      </div>
    </div>
  );
}

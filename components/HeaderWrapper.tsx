"use client";

import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";

const NAV_ITEMS = [
  { label: "Teachers", path: "/app/teachers-list" },
  { label: "Review", path: "/app/review" },
  { label: "Lessons", path: "/app/lessons" },
  { label: "Chats", path: "/app/chats" },
  { label: "Profile", path: "/app/profile" },
];

export default function HeaderWrapper() {
  const { data: session } = useSession();
  const pathName = usePathname();
  const router = useRouter();

  if (
    !session ||
    pathName === "/app/login" ||
    pathName === "/app/set-user-params" ||
    pathName.startsWith("/app/calling/") ||
    pathName === "/"
  )
    return null;

  return (
    <div className="navbar bg-base-200/80 backdrop-blur-md border-b border-base-300 sticky top-0 z-50">
      <div className="navbar-start">
        <span className="btn btn-ghost text-xl font-bold text-primary tracking-tight px-3">
          StudyApp
        </span>
      </div>
      <div className="navbar-center">
        <div className="flex gap-1">
          {NAV_ITEMS.map(({ label, path }) => (
            <button
              key={path}
              onClick={() => router.push(path)}
              className={`btn btn-sm rounded-xl transition-all duration-200 ${
                pathName === path
                  ? "btn-primary shadow-sm"
                  : "btn-ghost text-base-content/60 hover:text-base-content"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      <div className="navbar-end" />
    </div>
  );
}

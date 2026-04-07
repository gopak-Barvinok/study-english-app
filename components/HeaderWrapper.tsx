"use client";

import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";

export default function HeaderWrapper() {
  const { data: session } = useSession();
  const pathName = usePathname();
  const router = useRouter()

  if (
    !session ||
    pathName === "/app/login" ||
    pathName === "/app/set-user-params" ||
    pathName.startsWith("/app/calling/") ||
    pathName === "/"
  )
    return null;

  return (
    <div className="navbar bg-base-100 shadow-sm flex">
      <div className="navbar-start">
        <a className="btn btn-ghost text-xl">StudyApp</a>
      </div>
      <div className="tabs tabs-box bg-base-100 navbar-center">
        <input
          type="radio"
          name="tabs"
          className="tab"
          aria-label="Teachers"
          checked={pathName === "/app/teachers-list"}
          onChange={() => router.push("/app/teachers-list")}
        />
        <input
          type="radio"
          name="tabs"
          className="tab"
          aria-label="Review"
          checked={pathName === "/app/review"}
          onChange={() => router.push("/app/review")}
        />
        <input
          type="radio"
          name="tabs"
          className="tab"
          aria-label="Lessons"
          checked={pathName === "/app/lessons"}
          onChange={() => router.push("/app/lessons")}
        />
        <input
          type="radio"
          name="tabs"
          className="tab"
          aria-label="Chats"
          checked={pathName === "/app/chats"}
          onChange={() => router.push("/app/chats")}
        />
        <input
          type="radio"
          name="tabs"
          className="tab"
          aria-label="Profile"
          checked={
            pathName === "/app/profile"
          }
          onChange={() => router.push("/app/profile")}
        />
      </div>
      <div className="navbar-end">
          {/* <button className="btn btn-success">
            Teacher mode
          </button> */}
      </div>
    </div>
  );
}

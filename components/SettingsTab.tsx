"use client";

import { usePathname, useRouter } from "next/navigation";

export default function SettingsTab() {
  const pathName = usePathname();
  const router = useRouter();

  return (
    <div className="tabs flex-col">
      <input
        type="radio"
        name="tabs"
        className="tab"
        aria-label="Account"
        checked={pathName === "/app/profile/settings"}
        onChange={() => router.push("/app/profile/settings")}
      />
      <input
        type="radio"
        name="tabs"
        className="tab"
        aria-label="Teacher-mode"
        checked={pathName === "/app/profile/settings/teacher-mode"}
        onChange={() => router.push("/app/profile/settings/teacher-mode")}
      />
    </div>
  );
}

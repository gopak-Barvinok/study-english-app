"use client";

import { usePathname, useRouter } from "next/navigation";

const SETTINGS_TABS = [
  { label: "Account", path: "/app/profile/settings" },
  { label: "Teacher mode", path: "/app/profile/settings/teacher-mode" },
];

export default function SettingsTab() {
  const pathName = usePathname();
  const router = useRouter();

  return (
    <div className="flex flex-col gap-1 w-48">
      {SETTINGS_TABS.map(({ label, path }) => (
        <button
          key={path}
          onClick={() => router.push(path)}
          className={`btn btn-sm justify-start rounded-xl transition-all duration-200 ${
            pathName === path
              ? "btn-primary"
              : "btn-ghost text-base-content/60 hover:text-base-content"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

import React from "react";
import SettingsTab from "@/components/SettingsTab";

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-6 w-full max-w-3xl animate-fade-in mx-auto my-auto">
      <aside className="shrink-0">
        <SettingsTab />
      </aside>
      <main className="flex-1 min-w-0">
        {children}
      </main>
    </div>
  );
}

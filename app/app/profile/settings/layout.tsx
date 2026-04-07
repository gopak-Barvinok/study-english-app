import React from "react";
import SettingsTab from "@/components/SettingsTab";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-2">
      <div className="self-start">
        <SettingsTab />
      </div>
      <div className="self-start">{children}</div>
    </div>
  );
}

//w-full h-full items-center
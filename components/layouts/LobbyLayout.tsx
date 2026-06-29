"use client";

import { VideoPreview } from "@stream-io/video-react-sdk";
import { LobbyControlsButtons } from "../buttons/ControlsBtn";
import { useState } from "react";

interface LobbyLayoutProps {
  onJoin: (typeToggle: string) => void;
}

export default function LobbyLayout({ onJoin }: LobbyLayoutProps) {
  const [isChecked, setIsChecked] = useState(false);

  return (
    <div className="flex flex-col items-center gap-5 w-full max-w-lg animate-fade-in">
      <h1 className="text-2xl font-bold">Ready to join?</h1>

      <div className="bg-base-200 border border-base-300 rounded-2xl overflow-hidden shadow-xl w-full">
        <VideoPreview mirror={true} />
      </div>

      <LobbyControlsButtons />

      <label className="flex items-center gap-3 cursor-pointer select-none">
        <input
          type="checkbox"
          checked={isChecked}
          className="checkbox checkbox-primary"
          onChange={(e) => setIsChecked(e.target.checked)}
        />
        <span className="text-sm text-base-content/60">
          I agree to the Terms and Conditions
        </span>
      </label>

      <button
        className={`btn btn-primary w-full rounded-xl hover:-translate-y-0.5 transition-transform duration-200 ${
          !isChecked ? "opacity-40 cursor-not-allowed" : ""
        }`}
        disabled={!isChecked}
        onClick={() => onJoin("join")}
      >
        Join the room
      </button>
    </div>
  );
}

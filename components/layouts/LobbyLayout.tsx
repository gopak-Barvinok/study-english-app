"use client";

import { VideoPreview } from "@stream-io/video-react-sdk";
import { LobbyControlsButtons } from "../buttons/ControlsBtn";
import { useState } from "react";

interface LobbyLayoutProps {
  onJoin: (typeToggle: string) => void;
}

export default function LobbyLayout({ onJoin }: LobbyLayoutProps) {
  const [isChecked, setIsChecked] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsChecked(e.target.checked)
  }

  return (
    <div className="flex flex-col items-center gap-4">
      Lobby
      <VideoPreview mirror={true} />
      <LobbyControlsButtons />
      <div className="flex flex-row items-center gap-2">
        <input type="checkbox" checked={isChecked} className="checkbox checkbox-success" onChange={handleChange}/>
        <p>By checking this box, you agree to the Terms and Conditions</p>
      </div>
      <button
        className={`btn btn-accent ${!isChecked ? "btn-disabled" : ""}`}
        onClick={() => onJoin("join")}
      >
        Join to room
      </button>
    </div>
  );
}

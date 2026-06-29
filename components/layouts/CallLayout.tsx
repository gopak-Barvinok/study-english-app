"use client";

import {
  useCallStateHooks,
  CallingState,
  ParticipantView,
} from "@stream-io/video-react-sdk";
import { useParams } from "next/navigation";
import Loading from "../procedures/Loading";
import { CallingControlsButtons } from "../buttons/ControlsBtn";

type CallLayoutProps = {
  onLeave: (typeToggle: string) => void;
}

export default function CallLayout({ onLeave }: CallLayoutProps) {
  const { useCallCallingState, useRemoteParticipants, useLocalParticipant } =
    useCallStateHooks();
  const callingState = useCallCallingState();
  const params = useParams();
  const callId = params.id;
  const remoteParticipants = useRemoteParticipants();
  const localParticipant = useLocalParticipant();

  if (callingState !== CallingState.JOINED) {
    return <Loading />;
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex flex-row gap-2">
        {remoteParticipants.map((participant) => (
          <ParticipantView
            key={participant.sessionId}
            participant={participant}
            ParticipantViewUI={null}
          />
        ))}
        {localParticipant && (
          <ParticipantView
            ParticipantViewUI={null}
            participant={localParticipant}
          />
        )}
      </div>
      <CallingControlsButtons/>
      <button
        className="btn btn-error rounded-xl px-8 hover:-translate-y-0.5 transition-transform duration-200"
        onClick={() => onLeave("leave")}
      >
        Finish call
      </button>
    </div>
  );
}

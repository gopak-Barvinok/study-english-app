"use client";

import {
  useCallStateHooks,
  CallingState,
  SpeakerLayout,
  CallControls,
} from "@stream-io/video-react-sdk";
import Loading from "./procedures/Loading";

type Props = {
  callId: string;
};

export default function MyUILayout({ callId, }: Props) {
  const { useCallCallingState } = useCallStateHooks();
  const callingState = useCallCallingState();

  if (callingState !== CallingState.JOINED) {
    return <Loading />;
  }

  return (
    <div>
      <div>Call Id: {callId}</div>
      <SpeakerLayout participantsBarPosition="bottom" />
      <CallControls/>
      <button className="btn btn-error w-30">Finish call</button>
    </div>
  );
}

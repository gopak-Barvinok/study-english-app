import {
  CallingState,
  useCall,
  useCallStateHooks,
} from "@stream-io/video-react-sdk";
import LobbyLayout from "../layouts/LobbyLayout";
import Loading from "./Loading";
import CallLayout from "../layouts/CallLayout";
import AfterCallLayout from "../layouts/AfterCallLayout";
import { useUserStore } from "@/store/userStore";

export default function VideoStatesHandler() {
  const { useRemoteParticipants } = useCallStateHooks();
  const { useCallCallingState } = useCallStateHooks();
  const callingState = useCallCallingState();
  const call = useCall();
  const user = useUserStore(state => state.user);
  const remoteParticipants = useRemoteParticipants();
  const teacherId = remoteParticipants[0]?.userId;

  const handleToggle = async (typeToggle: string) => {
    if (!call) return;
    switch (typeToggle) {
      case "join":
        try {
          await call.join();
          if(user && !user.teacher) {
            await call.startTranscription();
          }
        } catch (e) {
          console.error("Failed to join:", e);
        }
        break;
      case "leave":
        if (user && !user.teacher) {
          try {
            await call.stopTranscription();
          } catch {
            // transcription may not be active
          }
        }
        try {
          await call.leave();
        } catch (e) {
          console.error("Failed to leave the call", e);
        }
        break;
    }
  };

  switch (callingState) {
    case CallingState.IDLE:
      return <LobbyLayout onJoin={handleToggle} />;
    case CallingState.JOINING:
      return <Loading />;
    case CallingState.JOINED:
      return <CallLayout onLeave={handleToggle} />;
    case CallingState.LEFT:
      return <AfterCallLayout teacherId={teacherId}/>;
    case CallingState.RECONNECTING:
      return <Loading />;
    case CallingState.MIGRATING:
      return <Loading />;
  }
}

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
  const { useCallCallingState } = useCallStateHooks();
  const callingState = useCallCallingState();
  const call = useCall();
  const user = useUserStore(state => state.user);

  const handleToggle = async (typeToggle: string) => {
    if (!call) return;
    switch (typeToggle) {
      case "join":
        try {
          await call.join();
          if(user?.role === "Student") {
            await call.startTranscription();
          }
        } catch (e) {
          console.error("Failed to join:", e);
        }
        break;
      case "leave":
        try {
          if(user?.role === "Student") {
            await call.stopTranscription();
          }
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
      return <AfterCallLayout />;
    case CallingState.RECONNECTING:
      return <Loading />;
    case CallingState.MIGRATING:
      return <Loading />;
  }
}

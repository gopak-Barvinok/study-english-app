import {
  ReactionsButton,
  ScreenShareButton,
  ToggleAudioOutputButton,
  ToggleAudioPreviewButton,
  ToggleAudioPublishingButton,
  ToggleVideoPreviewButton,
  ToggleVideoPublishingButton,
} from "@stream-io/video-react-sdk";

export const LobbyControlsButtons = () => {
  return (
    <div className="flex flex-row gap-2">
      <ToggleAudioPreviewButton />
      <ToggleVideoPreviewButton />
      <ToggleAudioOutputButton />
    </div>
  );
};

export const CallingControlsButtons = () => {
  return (
    <div className="flex flex-row gap-2">
      <ToggleAudioPublishingButton />
      <ToggleVideoPublishingButton />
      <ScreenShareButton />
      <ReactionsButton />
    </div>
  );
};

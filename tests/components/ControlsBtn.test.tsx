import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("@stream-io/video-react-sdk", () => ({
  ToggleAudioPreviewButton: () => <button>Toggle Audio Preview</button>,
  ToggleVideoPreviewButton: () => <button>Toggle Video Preview</button>,
  ToggleAudioOutputButton: () => <button>Toggle Audio Output</button>,
  ToggleAudioPublishingButton: () => <button>Toggle Audio Publishing</button>,
  ToggleVideoPublishingButton: () => <button>Toggle Video Publishing</button>,
  ScreenShareButton: () => <button>Screen Share</button>,
  ReactionsButton: () => <button>Reactions</button>,
}));

import { LobbyControlsButtons, CallingControlsButtons } from "@/components/buttons/ControlsBtn";

describe("LobbyControlsButtons", () => {
  it("renders audio preview button", () => {
    render(<LobbyControlsButtons />);
    expect(screen.getByRole("button", { name: /toggle audio preview/i })).toBeInTheDocument();
  });

  it("renders video preview button", () => {
    render(<LobbyControlsButtons />);
    expect(screen.getByRole("button", { name: /toggle video preview/i })).toBeInTheDocument();
  });

  it("renders audio output button", () => {
    render(<LobbyControlsButtons />);
    expect(screen.getByRole("button", { name: /toggle audio output/i })).toBeInTheDocument();
  });
});

describe("CallingControlsButtons", () => {
  it("renders audio publishing button", () => {
    render(<CallingControlsButtons />);
    expect(screen.getByRole("button", { name: /toggle audio publishing/i })).toBeInTheDocument();
  });

  it("renders video publishing button", () => {
    render(<CallingControlsButtons />);
    expect(screen.getByRole("button", { name: /toggle video publishing/i })).toBeInTheDocument();
  });

  it("renders screen share button", () => {
    render(<CallingControlsButtons />);
    expect(screen.getByRole("button", { name: /screen share/i })).toBeInTheDocument();
  });

  it("renders reactions button", () => {
    render(<CallingControlsButtons />);
    expect(screen.getByRole("button", { name: /reactions/i })).toBeInTheDocument();
  });
});

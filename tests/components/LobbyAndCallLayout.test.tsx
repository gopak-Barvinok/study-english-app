import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

vi.mock("next/navigation", () => ({
  usePathname: vi.fn().mockReturnValue("/app/calling/room-1"),
  useRouter: () => ({ push: vi.fn() }),
  useParams: vi.fn().mockReturnValue({ id: "room-1" }),
}));

const mockUseCallCallingState = vi.hoisted(() => vi.fn());
const mockUseRemoteParticipants = vi.hoisted(() => vi.fn().mockReturnValue([]));
const mockUseLocalParticipant = vi.hoisted(() => vi.fn().mockReturnValue(null));

vi.mock("@stream-io/video-react-sdk", () => ({
  CallingState: {
    IDLE: "IDLE",
    JOINING: "JOINING",
    JOINED: "JOINED",
    LEFT: "LEFT",
    RECONNECTING: "RECONNECTING",
    MIGRATING: "MIGRATING",
  },
  useCall: vi.fn().mockReturnValue(null),
  useCallStateHooks: vi.fn().mockReturnValue({
    useCallCallingState: mockUseCallCallingState,
    useRemoteParticipants: mockUseRemoteParticipants,
    useLocalParticipant: mockUseLocalParticipant,
  }),
  VideoPreview: ({ mirror }: any) => <div data-testid="video-preview" data-mirror={mirror} />,
  ParticipantView: ({ participant }: any) => (
    <div data-testid="participant-view" data-session={participant?.sessionId} />
  ),
  ToggleAudioPreviewButton: () => <button>Audio</button>,
  ToggleVideoPreviewButton: () => <button>Video</button>,
  ToggleAudioOutputButton: () => <button>Output</button>,
  ToggleAudioPublishingButton: () => <button>Mic</button>,
  ToggleVideoPublishingButton: () => <button>Cam</button>,
  ScreenShareButton: () => <button>Share</button>,
  ReactionsButton: () => <button>React</button>,
}));

import LobbyLayout from "@/components/layouts/LobbyLayout";
import CallLayout from "@/components/layouts/CallLayout";

beforeEach(() => {
  vi.clearAllMocks();
  mockUseCallCallingState.mockReturnValue("JOINED");
  mockUseRemoteParticipants.mockReturnValue([]);
  mockUseLocalParticipant.mockReturnValue(null);
});

// ─── LobbyLayout ──────────────────────────────────────────────────────────────
describe("LobbyLayout", () => {
  it("renders Ready to join heading", () => {
    render(<LobbyLayout onJoin={vi.fn()} />);
    expect(screen.getByText("Ready to join?")).toBeInTheDocument();
  });

  it("renders video preview", () => {
    render(<LobbyLayout onJoin={vi.fn()} />);
    expect(screen.getByTestId("video-preview")).toBeInTheDocument();
  });

  it("renders checkbox for terms agreement", () => {
    render(<LobbyLayout onJoin={vi.fn()} />);
    expect(screen.getByRole("checkbox")).toBeInTheDocument();
  });

  it("Join button is disabled when checkbox is unchecked", () => {
    render(<LobbyLayout onJoin={vi.fn()} />);
    expect(screen.getByRole("button", { name: /join the room/i })).toBeDisabled();
  });

  it("Join button is enabled when checkbox is checked", () => {
    render(<LobbyLayout onJoin={vi.fn()} />);
    fireEvent.click(screen.getByRole("checkbox"));
    expect(screen.getByRole("button", { name: /join the room/i })).not.toBeDisabled();
  });

  it("calls onJoin with 'join' when Join button clicked after accepting terms", () => {
    const onJoin = vi.fn();
    render(<LobbyLayout onJoin={onJoin} />);
    fireEvent.click(screen.getByRole("checkbox"));
    fireEvent.click(screen.getByRole("button", { name: /join the room/i }));
    expect(onJoin).toHaveBeenCalledWith("join");
  });

  it("renders terms and conditions text", () => {
    render(<LobbyLayout onJoin={vi.fn()} />);
    expect(screen.getByText(/terms and conditions/i)).toBeInTheDocument();
  });
});

// ─── CallLayout ───────────────────────────────────────────────────────────────
describe("CallLayout", () => {
  it("renders Finish call button when JOINED", () => {
    mockUseCallCallingState.mockReturnValue("JOINED");
    render(<CallLayout onLeave={vi.fn()} />);
    expect(screen.getByRole("button", { name: /finish call/i })).toBeInTheDocument();
  });

  it("shows Loading when not JOINED", () => {
    mockUseCallCallingState.mockReturnValue("JOINING");
    render(<CallLayout onLeave={vi.fn()} />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("calls onLeave with 'leave' when Finish call is clicked", () => {
    mockUseCallCallingState.mockReturnValue("JOINED");
    const onLeave = vi.fn();
    render(<CallLayout onLeave={onLeave} />);
    fireEvent.click(screen.getByRole("button", { name: /finish call/i }));
    expect(onLeave).toHaveBeenCalledWith("leave");
  });

  it("renders remote participant views when participants exist", () => {
    mockUseCallCallingState.mockReturnValue("JOINED");
    mockUseRemoteParticipants.mockReturnValue([
      { sessionId: "s1", userId: "u1" },
      { sessionId: "s2", userId: "u2" },
    ]);
    render(<CallLayout onLeave={vi.fn()} />);
    const views = screen.getAllByTestId("participant-view");
    expect(views.length).toBe(2);
  });

  it("renders local participant view when present", () => {
    mockUseCallCallingState.mockReturnValue("JOINED");
    mockUseLocalParticipant.mockReturnValue({ sessionId: "local-1", userId: "me" });
    render(<CallLayout onLeave={vi.fn()} />);
    const views = screen.getAllByTestId("participant-view");
    expect(views.length).toBe(1);
  });
});

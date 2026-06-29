import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";

const mockUseCallCallingState = vi.hoisted(() => vi.fn());
const mockUseRemoteParticipants = vi.hoisted(() => vi.fn().mockReturnValue([]));
const mockUseCall = vi.hoisted(() => vi.fn().mockReturnValue(null));

vi.mock("@stream-io/video-react-sdk", () => ({
  CallingState: {
    IDLE: "IDLE",
    JOINING: "JOINING",
    JOINED: "JOINED",
    LEFT: "LEFT",
    RECONNECTING: "RECONNECTING",
    MIGRATING: "MIGRATING",
  },
  useCall: mockUseCall,
  useCallStateHooks: vi.fn().mockReturnValue({
    useCallCallingState: mockUseCallCallingState,
    useRemoteParticipants: mockUseRemoteParticipants,
    useLocalParticipant: vi.fn().mockReturnValue(null),
  }),
  VideoPreview: () => <div data-testid="video-preview" />,
  ParticipantView: () => <div data-testid="participant-view" />,
  ToggleAudioPreviewButton: () => <button>Toggle Audio Preview</button>,
  ToggleAudioPublishingButton: () => <button>Toggle Audio Publishing</button>,
  ToggleVideoPublishingButton: () => <button>Toggle Video Publishing</button>,
  ScreenShareButton: () => <button>Screen Share</button>,
  ReactionsButton: () => <button>Reactions</button>,
  ToggleAudioOutputButton: () => <button>Toggle Audio Output</button>,
  ToggleVideoPreviewButton: () => <button>Toggle Video Preview</button>,
}));

vi.mock("next/navigation", () => ({
  usePathname: vi.fn().mockReturnValue("/app/calling/room-1"),
  useRouter: () => ({ push: vi.fn() }),
  useParams: vi.fn().mockReturnValue({ id: "room-1" }),
}));

vi.mock("@/store/userStore", () => ({
  useUserStore: (selector: any) => selector({ user: { id: "u1", teacher: null } }),
}));

import VideoStatesHandler from "@/components/procedures/VideoStatesHandler";

function makeMockCall() {
  return {
    join: vi.fn().mockResolvedValue(undefined),
    leave: vi.fn().mockResolvedValue(undefined),
    startTranscription: vi.fn().mockResolvedValue(undefined),
    stopTranscription: vi.fn().mockResolvedValue(undefined),
  };
}

beforeEach(() => {
  vi.clearAllMocks();
  mockUseRemoteParticipants.mockReturnValue([]);
  mockUseCall.mockReturnValue(null);
});

describe("VideoStatesHandler – state rendering", () => {
  it("renders LobbyLayout when state is IDLE", () => {
    mockUseCallCallingState.mockReturnValue("IDLE");
    render(<VideoStatesHandler />);
    expect(screen.getByText("Ready to join?")).toBeInTheDocument();
  });

  it("renders Loading when state is JOINING", () => {
    mockUseCallCallingState.mockReturnValue("JOINING");
    render(<VideoStatesHandler />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("renders Loading when state is RECONNECTING", () => {
    mockUseCallCallingState.mockReturnValue("RECONNECTING");
    render(<VideoStatesHandler />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("renders Loading when state is MIGRATING", () => {
    mockUseCallCallingState.mockReturnValue("MIGRATING");
    render(<VideoStatesHandler />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("renders CallLayout when state is JOINED", () => {
    mockUseCallCallingState.mockReturnValue("JOINED");
    render(<VideoStatesHandler />);
    expect(screen.getByRole("button", { name: /finish call/i })).toBeInTheDocument();
  });

  it("renders AfterCallLayout when state is LEFT", () => {
    mockUseCallCallingState.mockReturnValue("LEFT");
    render(<VideoStatesHandler />);
    expect(screen.getByText("Lesson complete!")).toBeInTheDocument();
  });

  it("passes teacherId from remote participants to AfterCallLayout", () => {
    mockUseCallCallingState.mockReturnValue("LEFT");
    mockUseRemoteParticipants.mockReturnValue([{ userId: "teacher-1" }]);
    render(<VideoStatesHandler />);
    expect(screen.getByText("Lesson complete!")).toBeInTheDocument();
  });
});

describe("VideoStatesHandler – handleToggle join", () => {
  it("calls call.join() when Join button is clicked (student user)", async () => {
    mockUseCallCallingState.mockReturnValue("IDLE");
    const mockCall = makeMockCall();
    mockUseCall.mockReturnValue(mockCall);

    render(<VideoStatesHandler />);

    fireEvent.click(screen.getByRole("checkbox"));
    fireEvent.click(screen.getByRole("button", { name: /join the room/i }));

    await waitFor(() => {
      expect(mockCall.join).toHaveBeenCalled();
    });
  });

  it("calls startTranscription() for student user after joining", async () => {
    mockUseCallCallingState.mockReturnValue("IDLE");
    const mockCall = makeMockCall();
    mockUseCall.mockReturnValue(mockCall);

    render(<VideoStatesHandler />);

    fireEvent.click(screen.getByRole("checkbox"));
    fireEvent.click(screen.getByRole("button", { name: /join the room/i }));

    await waitFor(() => {
      expect(mockCall.startTranscription).toHaveBeenCalled();
    });
  });

  it("does not throw when call is null and join is triggered", () => {
    mockUseCallCallingState.mockReturnValue("IDLE");
    mockUseCall.mockReturnValue(null);

    render(<VideoStatesHandler />);

    fireEvent.click(screen.getByRole("checkbox"));
    expect(() =>
      fireEvent.click(screen.getByRole("button", { name: /join the room/i }))
    ).not.toThrow();
  });

  it("handles join error gracefully", async () => {
    mockUseCallCallingState.mockReturnValue("IDLE");
    const mockCall = makeMockCall();
    mockCall.join.mockRejectedValueOnce(new Error("join failed"));
    mockUseCall.mockReturnValue(mockCall);

    render(<VideoStatesHandler />);

    fireEvent.click(screen.getByRole("checkbox"));
    expect(() =>
      fireEvent.click(screen.getByRole("button", { name: /join the room/i }))
    ).not.toThrow();

    await waitFor(() => {
      expect(mockCall.join).toHaveBeenCalled();
    });
  });
});

describe("VideoStatesHandler – handleToggle leave", () => {
  it("calls call.leave() when Finish call is clicked", async () => {
    mockUseCallCallingState.mockReturnValue("JOINED");
    const mockCall = makeMockCall();
    mockUseCall.mockReturnValue(mockCall);

    render(<VideoStatesHandler />);

    fireEvent.click(screen.getByRole("button", { name: /finish call/i }));

    await waitFor(() => {
      expect(mockCall.leave).toHaveBeenCalled();
    });
  });

  it("calls stopTranscription() for student user before leaving", async () => {
    mockUseCallCallingState.mockReturnValue("JOINED");
    const mockCall = makeMockCall();
    mockUseCall.mockReturnValue(mockCall);

    render(<VideoStatesHandler />);

    fireEvent.click(screen.getByRole("button", { name: /finish call/i }));

    await waitFor(() => {
      expect(mockCall.stopTranscription).toHaveBeenCalled();
      expect(mockCall.leave).toHaveBeenCalled();
    });
  });

  it("handles stopTranscription error gracefully and still calls leave()", async () => {
    mockUseCallCallingState.mockReturnValue("JOINED");
    const mockCall = makeMockCall();
    mockCall.stopTranscription.mockRejectedValueOnce(new Error("not active"));
    mockUseCall.mockReturnValue(mockCall);

    render(<VideoStatesHandler />);
    fireEvent.click(screen.getByRole("button", { name: /finish call/i }));

    await waitFor(() => {
      expect(mockCall.leave).toHaveBeenCalled();
    });
  });

  it("does not throw when call is null and leave is triggered", () => {
    mockUseCallCallingState.mockReturnValue("JOINED");
    mockUseCall.mockReturnValue(null);

    render(<VideoStatesHandler />);

    expect(() =>
      fireEvent.click(screen.getByRole("button", { name: /finish call/i }))
    ).not.toThrow();
  });
});

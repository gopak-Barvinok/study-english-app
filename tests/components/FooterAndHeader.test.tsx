import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

const mockUseSession = vi.hoisted(() => vi.fn());
const mockPathname = vi.hoisted(() => vi.fn());
const mockPush = vi.hoisted(() => vi.fn());

vi.mock("next-auth/react", () => ({
  useSession: mockUseSession,
  signIn: vi.fn(),
  signOut: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  usePathname: mockPathname,
  useRouter: () => ({ push: mockPush }),
}));

import FooterWrapper from "@/components/FooterWrapper";
import HeaderWrapper from "@/components/HeaderWrapper";

beforeEach(() => {
  vi.clearAllMocks();
});

// ─── FooterWrapper ─────────────────────────────────────────────────────────────
describe("FooterWrapper", () => {
  it("renders footer when session exists and path is /", () => {
    mockUseSession.mockReturnValue({ data: { user: { id: "u1" } } });
    mockPathname.mockReturnValue("/");

    render(<FooterWrapper />);
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
  });

  it("returns null when there is no session", () => {
    mockUseSession.mockReturnValue({ data: null });
    mockPathname.mockReturnValue("/");

    const { container } = render(<FooterWrapper />);
    expect(container.firstChild).toBeNull();
  });

  it("returns null when pathname is not /", () => {
    mockUseSession.mockReturnValue({ data: { user: { id: "u1" } } });
    mockPathname.mockReturnValue("/app");

    const { container } = render(<FooterWrapper />);
    expect(container.firstChild).toBeNull();
  });

  it("shows copyright text", () => {
    mockUseSession.mockReturnValue({ data: { user: { id: "u1" } } });
    mockPathname.mockReturnValue("/");

    render(<FooterWrapper />);
    expect(screen.getByText(/StudyApp/)).toBeInTheDocument();
  });
});

// ─── HeaderWrapper ─────────────────────────────────────────────────────────────
describe("HeaderWrapper", () => {
  it("renders nav when session exists and path is a normal app route", () => {
    mockUseSession.mockReturnValue({ data: { user: { id: "u1" } } });
    mockPathname.mockReturnValue("/app/teachers-list");

    render(<HeaderWrapper />);
    expect(screen.getByRole("button", { name: "Teachers" })).toBeInTheDocument();
  });

  it("returns null when there is no session", () => {
    mockUseSession.mockReturnValue({ data: null });
    mockPathname.mockReturnValue("/app/teachers-list");

    const { container } = render(<HeaderWrapper />);
    expect(container.firstChild).toBeNull();
  });

  it("returns null on /app/login page", () => {
    mockUseSession.mockReturnValue({ data: { user: { id: "u1" } } });
    mockPathname.mockReturnValue("/app/login");

    const { container } = render(<HeaderWrapper />);
    expect(container.firstChild).toBeNull();
  });

  it("returns null on /app/set-user-params page", () => {
    mockUseSession.mockReturnValue({ data: { user: { id: "u1" } } });
    mockPathname.mockReturnValue("/app/set-user-params");

    const { container } = render(<HeaderWrapper />);
    expect(container.firstChild).toBeNull();
  });

  it("returns null on calling page", () => {
    mockUseSession.mockReturnValue({ data: { user: { id: "u1" } } });
    mockPathname.mockReturnValue("/app/calling/room-1");

    const { container } = render(<HeaderWrapper />);
    expect(container.firstChild).toBeNull();
  });

  it("returns null on / (landing page)", () => {
    mockUseSession.mockReturnValue({ data: { user: { id: "u1" } } });
    mockPathname.mockReturnValue("/");

    const { container } = render(<HeaderWrapper />);
    expect(container.firstChild).toBeNull();
  });

  it("renders all nav items", () => {
    mockUseSession.mockReturnValue({ data: { user: { id: "u1" } } });
    mockPathname.mockReturnValue("/app/profile");

    render(<HeaderWrapper />);
    expect(screen.getByRole("button", { name: "Teachers" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Review" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Lessons" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Chats" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Profile" })).toBeInTheDocument();
  });

  it("navigates on nav item click", () => {
    mockUseSession.mockReturnValue({ data: { user: { id: "u1" } } });
    mockPathname.mockReturnValue("/app/profile");

    render(<HeaderWrapper />);
    fireEvent.click(screen.getByRole("button", { name: "Teachers" }));
    expect(mockPush).toHaveBeenCalledWith("/app/teachers-list");
  });

  it("highlights active nav item", () => {
    mockUseSession.mockReturnValue({ data: { user: { id: "u1" } } });
    mockPathname.mockReturnValue("/app/teachers-list");

    render(<HeaderWrapper />);
    const teachersBtn = screen.getByRole("button", { name: "Teachers" });
    expect(teachersBtn.className).toContain("btn-primary");
  });
});

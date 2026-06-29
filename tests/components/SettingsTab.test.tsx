import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

const mockPush = vi.hoisted(() => vi.fn());
const mockPathname = vi.hoisted(() => vi.fn().mockReturnValue("/app/profile/settings"));

vi.mock("next/navigation", () => ({
  usePathname: mockPathname,
  useRouter: () => ({ push: mockPush }),
}));

import SettingsTab from "@/components/SettingsTab";

beforeEach(() => {
  vi.clearAllMocks();
  mockPathname.mockReturnValue("/app/profile/settings");
});

describe("SettingsTab", () => {
  it("renders all tab buttons", () => {
    render(<SettingsTab />);
    expect(screen.getByRole("button", { name: "Account" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Teacher mode" })).toBeInTheDocument();
  });

  it("highlights Account tab when path matches", () => {
    mockPathname.mockReturnValue("/app/profile/settings");
    render(<SettingsTab />);
    const accountBtn = screen.getByRole("button", { name: "Account" });
    expect(accountBtn.className).toContain("btn-primary");
  });

  it("highlights Teacher mode tab when path matches", () => {
    mockPathname.mockReturnValue("/app/profile/settings/teacher-mode");
    render(<SettingsTab />);
    const teacherBtn = screen.getByRole("button", { name: "Teacher mode" });
    expect(teacherBtn.className).toContain("btn-primary");
  });

  it("navigates to Account settings on click", () => {
    render(<SettingsTab />);
    fireEvent.click(screen.getByRole("button", { name: "Account" }));
    expect(mockPush).toHaveBeenCalledWith("/app/profile/settings");
  });

  it("navigates to Teacher mode on click", () => {
    render(<SettingsTab />);
    fireEvent.click(screen.getByRole("button", { name: "Teacher mode" }));
    expect(mockPush).toHaveBeenCalledWith("/app/profile/settings/teacher-mode");
  });

  it("non-active tab does not have btn-primary class", () => {
    mockPathname.mockReturnValue("/app/profile/settings");
    render(<SettingsTab />);
    const teacherBtn = screen.getByRole("button", { name: "Teacher mode" });
    expect(teacherBtn.className).not.toContain("btn-primary");
  });
});

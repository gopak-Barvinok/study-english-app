import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

const mockSignOut = vi.hoisted(() => vi.fn());
vi.mock("next-auth/react", () => ({
  signOut: mockSignOut,
}));

import SignOutBtn from "@/components/buttons/loginButtons/SignOutBtn";

describe("SignOutBtn", () => {
  it("renders a button", () => {
    render(<SignOutBtn />);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("shows Sign out text", () => {
    render(<SignOutBtn />);
    expect(screen.getByText(/sign out/i)).toBeInTheDocument();
  });

  it("calls signOut with callbackUrl when clicked", () => {
    render(<SignOutBtn />);
    fireEvent.click(screen.getByRole("button"));
    expect(mockSignOut).toHaveBeenCalledWith({ callbackUrl: "/" });
  });
});

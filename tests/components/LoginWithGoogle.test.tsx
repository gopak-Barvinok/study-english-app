import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

const mockSignIn = vi.hoisted(() => vi.fn());
vi.mock("next-auth/react", () => ({
  signIn: mockSignIn,
}));

import LoginWithGoogle from "@/components/buttons/loginButtons/LoginWithGoogle";

describe("LoginWithGoogle", () => {
  it("renders the button", () => {
    render(<LoginWithGoogle />);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("shows Google login text", () => {
    render(<LoginWithGoogle />);
    expect(screen.getByText(/continue with google/i)).toBeInTheDocument();
  });

  it("calls signIn with 'google' when clicked", () => {
    render(<LoginWithGoogle />);
    fireEvent.click(screen.getByRole("button"));
    expect(mockSignIn).toHaveBeenCalledWith("google");
  });

  it("renders SVG Google logo", () => {
    const { container } = render(<LoginWithGoogle />);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });
});

import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import SetAgeComponent from "@/components/SetAgeComponent";

describe("SetAgeComponent", () => {
  it("renders the heading", () => {
    render(<SetAgeComponent toggleAge={vi.fn()} pageIsReady={vi.fn()} />);
    expect(screen.getByText("Your date of birth")).toBeInTheDocument();
  });

  it("renders the date input", () => {
    render(<SetAgeComponent toggleAge={vi.fn()} pageIsReady={vi.fn()} />);
    const input = document.querySelector("input[type='date']");
    expect(input).toBeInTheDocument();
  });

  it("calls toggleAge when date changes", () => {
    const toggleAge = vi.fn();
    render(<SetAgeComponent toggleAge={toggleAge} pageIsReady={vi.fn()} />);

    const input = document.querySelector("input[type=date]") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "1990-05-15" } });

    expect(toggleAge).toHaveBeenCalledWith("1990-05-15");
  });

  it("renders Continue button", () => {
    render(<SetAgeComponent toggleAge={vi.fn()} pageIsReady={vi.fn()} />);
    expect(screen.getByRole("button", { name: /continue/i })).toBeInTheDocument();
  });

  it("calls pageIsReady when Continue is clicked", () => {
    const pageIsReady = vi.fn();
    render(<SetAgeComponent toggleAge={vi.fn()} pageIsReady={pageIsReady} />);

    fireEvent.click(screen.getByRole("button", { name: /continue/i }));
    expect(pageIsReady).toHaveBeenCalledTimes(1);
  });

  it("renders subtitle text", () => {
    render(<SetAgeComponent toggleAge={vi.fn()} pageIsReady={vi.fn()} />);
    expect(
      screen.getByText("We'll use this to personalize your experience")
    ).toBeInTheDocument();
  });
});

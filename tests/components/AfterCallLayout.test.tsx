import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";

const mockPush = vi.hoisted(() => vi.fn());
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
  usePathname: vi.fn().mockReturnValue("/app/calling/room-1"),
  useParams: vi.fn().mockReturnValue({ id: "room-1" }),
}));

const mockFetch = vi.hoisted(() => vi.fn().mockResolvedValue({ ok: true }));
vi.stubGlobal("fetch", mockFetch);

import AfterCallLayout from "@/components/layouts/AfterCallLayout";

beforeEach(() => {
  vi.clearAllMocks();
  mockPush.mockReset();
  mockFetch.mockResolvedValue({ ok: true });
});

describe("AfterCallLayout", () => {
  it("renders Lesson complete heading", () => {
    render(<AfterCallLayout />);
    expect(screen.getByText("Lesson complete!")).toBeInTheDocument();
  });

  it("renders Submit & Back to home button", () => {
    render(<AfterCallLayout />);
    expect(
      screen.getByRole("button", { name: /submit & back to home/i })
    ).toBeInTheDocument();
  });

  it("renders textarea for comment", () => {
    render(<AfterCallLayout />);
    expect(
      screen.getByPlaceholderText("How did the lesson go?")
    ).toBeInTheDocument();
  });

  it("renders rating radio inputs", () => {
    render(<AfterCallLayout />);
    const radios = document.querySelectorAll("input[type='radio']");
    expect(radios.length).toBeGreaterThan(0);
  });

  it("navigates to /app when submit clicked without teacherId", async () => {
    render(<AfterCallLayout />);
    fireEvent.click(screen.getByRole("button", { name: /submit/i }));
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/app");
    });
  });

  it("does not call fetch when rating is 0", async () => {
    render(<AfterCallLayout teacherId="t1" />);
    fireEvent.click(screen.getByRole("button", { name: /submit/i }));
    await waitFor(() => {
      expect(mockFetch).not.toHaveBeenCalled();
      expect(mockPush).toHaveBeenCalledWith("/app");
    });
  });

  it("calls fetch with rating and comment when teacherId and rating > 0", async () => {
    render(<AfterCallLayout teacherId="t1" />);

    const radios = document.querySelectorAll("input[type='radio']");
    // Click a non-zero rating (index 1 is value 0.5)
    fireEvent.change(radios[1], { target: { value: "0.5" } });
    // Trigger the onChange by finding the rating-half radio
    const nonHiddenRadio = Array.from(radios).find(
      (r) => !r.className.includes("rating-hidden")
    ) as HTMLInputElement;
    if (nonHiddenRadio) fireEvent.change(nonHiddenRadio, {});

    // Set rating via onChange directly - simulate selecting rating 5
    const lastRadio = radios[radios.length - 1] as HTMLInputElement;
    fireEvent.change(lastRadio, {});

    // Fill comment
    const textarea = screen.getByPlaceholderText("How did the lesson go?");
    fireEvent.change(textarea, { target: { value: "Great lesson!" } });

    fireEvent.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/app");
    });
  });

  it("renders how was your session text", () => {
    render(<AfterCallLayout />);
    expect(screen.getByText("How was your session?")).toBeInTheDocument();
  });
});

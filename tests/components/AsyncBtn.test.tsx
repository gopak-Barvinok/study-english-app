import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AsyncButton from "@/components/buttons/AsyncBtn";

describe("AsyncButton", () => {
  it("renders with normal text initially", () => {
    render(
      <AsyncButton
        func={async () => {}}
        isNormalText="Submit"
        isLoadingText="Submitting..."
        className="btn"
      />
    );
    expect(screen.getByRole("button")).toHaveTextContent("Submit");
  });

  it("shows loading text while function is executing", async () => {
    let resolve!: () => void;
    const slowFn = () =>
      new Promise<void>((r) => {
        resolve = r;
      });

    render(
      <AsyncButton
        func={slowFn}
        isNormalText="Submit"
        isLoadingText="Submitting..."
        className="btn"
      />
    );

    fireEvent.click(screen.getByRole("button"));

    await waitFor(() => {
      expect(screen.getByRole("button")).toHaveTextContent("Submitting...");
    });

    resolve();

    await waitFor(() => {
      expect(screen.getByRole("button")).toHaveTextContent("Submit");
    });
  });

  it("disables button while loading", async () => {
    let resolve!: () => void;
    const slowFn = () => new Promise<void>((r) => { resolve = r; });

    render(
      <AsyncButton
        func={slowFn}
        isNormalText="Go"
        isLoadingText="Going..."
        className="btn"
      />
    );

    fireEvent.click(screen.getByRole("button"));

    await waitFor(() => {
      expect(screen.getByRole("button")).toBeDisabled();
    });

    resolve();
    await waitFor(() => {
      expect(screen.getByRole("button")).not.toBeDisabled();
    });
  });

  it("re-enables button after function completes", async () => {
    const fn = vi.fn().mockResolvedValueOnce(undefined);

    render(
      <AsyncButton
        func={fn}
        isNormalText="Click"
        isLoadingText="Loading..."
        className="btn"
      />
    );

    fireEvent.click(screen.getByRole("button"));

    await waitFor(() => {
      expect(screen.getByRole("button")).not.toBeDisabled();
    });
  });

  it("re-enables button after function throws an error", async () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const fn = vi.fn().mockRejectedValueOnce(new Error("fail"));

    render(
      <AsyncButton
        func={fn}
        isNormalText="Click"
        isLoadingText="Loading..."
        className="btn"
      />
    );

    fireEvent.click(screen.getByRole("button"));

    await waitFor(() => {
      expect(screen.getByRole("button")).not.toBeDisabled();
      expect(screen.getByRole("button")).toHaveTextContent("Click");
    });

    consoleSpy.mockRestore();
  });

  it("applies the provided className to the button", () => {
    render(
      <AsyncButton
        func={async () => {}}
        isNormalText="Test"
        isLoadingText="Loading"
        className="my-custom-class"
      />
    );
    expect(screen.getByRole("button")).toHaveClass("my-custom-class");
  });

  it("calls the provided function when clicked", async () => {
    const fn = vi.fn().mockResolvedValueOnce(undefined);

    render(
      <AsyncButton
        func={fn}
        isNormalText="Click"
        isLoadingText="Loading..."
        className="btn"
      />
    );

    fireEvent.click(screen.getByRole("button"));
    await waitFor(() => expect(fn).toHaveBeenCalledTimes(1));
  });
});

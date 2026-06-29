import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";

const mockFetch = vi.hoisted(() => vi.fn());
vi.stubGlobal("fetch", mockFetch);

import BookTeacherInModal from "@/components/modals/BookTeacherInModal";

const teacherScheduleResponse = {
  user: {
    event: [
      { slot: "Mon-9:00" },
      { slot: "Mon-10:00" },
      { slot: "Tue-14:00" },
    ],
  },
};

beforeEach(() => {
  vi.clearAllMocks();
  mockFetch.mockResolvedValue({
    json: async () => teacherScheduleResponse,
  });
});

describe("BookTeacherInModal", () => {
  it("renders day selection step with 'Choose a day' heading", async () => {
    render(
      <BookTeacherInModal teacherId="t1" userId="u1" uploadToBook={vi.fn()} />
    );
    expect(screen.getByText("Choose a day")).toBeInTheDocument();
  });

  it("fetches teacher schedule on mount", async () => {
    render(
      <BookTeacherInModal teacherId="t1" userId="u1" uploadToBook={vi.fn()} />
    );

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        "/api/teacher-params",
        expect.objectContaining({ headers: { "X-Teacher-Id": "t1" } })
      );
    });
  });

  it("enables Mon button when teacher has Mon slots", async () => {
    render(
      <BookTeacherInModal teacherId="t1" userId="u1" uploadToBook={vi.fn()} />
    );

    await waitFor(() => {
      const monBtn = screen.getByRole("button", { name: "Mon" });
      expect(monBtn).not.toBeDisabled();
    });
  });

  it("enables Tue button when teacher has Tue slots", async () => {
    render(
      <BookTeacherInModal teacherId="t1" userId="u1" uploadToBook={vi.fn()} />
    );

    await waitFor(() => {
      const tueBtn = screen.getByRole("button", { name: "Tue" });
      expect(tueBtn).not.toBeDisabled();
    });
  });

  it("advances to hour selection when a day button is clicked", async () => {
    render(
      <BookTeacherInModal teacherId="t1" userId="u1" uploadToBook={vi.fn()} />
    );

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Mon" })).not.toBeDisabled();
    });
    fireEvent.click(screen.getByRole("button", { name: "Mon" }));

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "9:00" })).toBeInTheDocument();
    });
  });

  it("shows back arrow button on step 2", async () => {
    render(
      <BookTeacherInModal teacherId="t1" userId="u1" uploadToBook={vi.fn()} />
    );

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Mon" })).not.toBeDisabled();
    });
    fireEvent.click(screen.getByRole("button", { name: "Mon" }));

    await waitFor(() => {
      // Back button shows ← arrow
      expect(screen.getByRole("button", { name: "←" })).toBeInTheDocument();
    });
  });

  it("goes back to step 1 when ← button is clicked", async () => {
    render(
      <BookTeacherInModal teacherId="t1" userId="u1" uploadToBook={vi.fn()} />
    );

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Mon" })).not.toBeDisabled();
    });
    fireEvent.click(screen.getByRole("button", { name: "Mon" }));
    await waitFor(() => screen.getByRole("button", { name: "←" }));
    fireEvent.click(screen.getByRole("button", { name: "←" }));

    await waitFor(() => {
      expect(screen.getByText("Choose a day")).toBeInTheDocument();
    });
    expect(screen.queryByRole("button", { name: "←" })).not.toBeInTheDocument();
  });

  it("calls uploadToBook when a slot is selected and Book lesson is clicked", async () => {
    const uploadToBook = vi.fn().mockResolvedValueOnce(undefined);

    render(
      <BookTeacherInModal teacherId="t1" userId="u1" uploadToBook={uploadToBook} />
    );

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Mon" })).not.toBeDisabled();
    });
    fireEvent.click(screen.getByRole("button", { name: "Mon" }));

    await waitFor(() => screen.getByRole("button", { name: "9:00" }));
    fireEvent.click(screen.getByRole("button", { name: "9:00" }));

    await waitFor(() => screen.getByRole("button", { name: "Book lesson" }));
    fireEvent.click(screen.getByRole("button", { name: "Book lesson" }));

    await waitFor(() => {
      expect(uploadToBook).toHaveBeenCalled();
    });
  });
});

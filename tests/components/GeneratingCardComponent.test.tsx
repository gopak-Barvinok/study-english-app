import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import GeneratingCardsComponent from "@/components/GeneratingCardComponent";

const sampleCards = [
  {
    front: "persistent",
    back: "continuing firmly in a course of action",
    example: "She was persistent.",
    translation: "настійливий",
    type: "word",
  },
  {
    front: "resilient",
    back: "able to withstand or recover quickly",
    example: "He is resilient.",
    translation: "стійкий",
    type: "word",
  },
];

describe("GeneratingCardsComponent", () => {
  it("returns null when cards array is empty", () => {
    const { container } = render(<GeneratingCardsComponent cards={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it("renders the first card's back text", () => {
    render(<GeneratingCardsComponent cards={sampleCards} />);
    expect(
      screen.getByText("continuing firmly in a course of action")
    ).toBeInTheDocument();
  });

  it("shows card counter (1 / 2)", () => {
    render(<GeneratingCardsComponent cards={sampleCards} />);
    expect(screen.getByText("1 / 2")).toBeInTheDocument();
  });

  it("shows the Check button initially", () => {
    render(<GeneratingCardsComponent cards={sampleCards} />);
    expect(screen.getByRole("button", { name: /check/i })).toBeInTheDocument();
  });

  it("shows Correct! when correct answer is typed and Check is clicked", () => {
    render(<GeneratingCardsComponent cards={sampleCards} />);

    const input = screen.getByPlaceholderText("Type the translation...");
    fireEvent.change(input, { target: { value: "persistent" } });
    fireEvent.click(screen.getByRole("button", { name: /check/i }));

    expect(screen.getByText("Correct!")).toBeInTheDocument();
  });

  it("shows Wrong when incorrect answer is typed", () => {
    render(<GeneratingCardsComponent cards={sampleCards} />);

    const input = screen.getByPlaceholderText("Type the translation...");
    fireEvent.change(input, { target: { value: "wrong" } });
    fireEvent.click(screen.getByRole("button", { name: /check/i }));

    expect(screen.getByText("Wrong")).toBeInTheDocument();
  });

  it("advances to next card when Next card is clicked", () => {
    render(<GeneratingCardsComponent cards={sampleCards} />);

    // Accept current card
    const input = screen.getByPlaceholderText("Type the translation...");
    fireEvent.change(input, { target: { value: "persistent" } });
    fireEvent.click(screen.getByRole("button", { name: /check/i }));

    // Go to next card
    fireEvent.click(screen.getByRole("button", { name: /next card/i }));

    expect(screen.getByText("2 / 2")).toBeInTheDocument();
    expect(screen.getByText("able to withstand or recover quickly")).toBeInTheDocument();
  });

  it("wraps around to first card after last card", () => {
    render(<GeneratingCardsComponent cards={sampleCards} />);

    // Accept and advance twice
    for (let i = 0; i < 2; i++) {
      const input = screen.getByPlaceholderText("Type the translation...");
      fireEvent.change(input, { target: { value: "ans" } });
      fireEvent.click(screen.getByRole("button", { name: /check/i }));
      fireEvent.click(screen.getByRole("button", { name: /next card/i }));
    }

    // Should be back at index 0
    expect(screen.getByText("1 / 2")).toBeInTheDocument();
  });

  it("is case-insensitive when checking answer", () => {
    render(<GeneratingCardsComponent cards={sampleCards} />);

    const input = screen.getByPlaceholderText("Type the translation...");
    fireEvent.change(input, { target: { value: "PERSISTENT" } });
    fireEvent.click(screen.getByRole("button", { name: /check/i }));

    expect(screen.getByText("Correct!")).toBeInTheDocument();
  });

  it("resets text and accept state on next card", () => {
    render(<GeneratingCardsComponent cards={sampleCards} />);

    const input = screen.getByPlaceholderText("Type the translation...");
    fireEvent.change(input, { target: { value: "persistent" } });
    fireEvent.click(screen.getByRole("button", { name: /check/i }));
    fireEvent.click(screen.getByRole("button", { name: /next card/i }));

    expect(screen.getByPlaceholderText("Type the translation...")).toHaveValue("");
  });
});

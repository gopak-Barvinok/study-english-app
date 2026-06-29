import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import CardComponent from "@/components/CardComponent";

const defaultProps = {
  back: "continuing firmly in a course of action",
  example: "She was persistent in asking.",
  front: "persistent",
  translate: "настійливий",
  reloadCard: vi.fn(),
  accept: false,
  acceptCard: vi.fn(),
  text: "",
  setText: vi.fn(),
  isCorrect: null,
};

describe("CardComponent", () => {
  it("renders back (definition) text", () => {
    render(<CardComponent {...defaultProps} />);
    expect(screen.getByText("continuing firmly in a course of action")).toBeInTheDocument();
  });

  it("renders the example sentence", () => {
    render(<CardComponent {...defaultProps} />);
    expect(screen.getByText("She was persistent in asking.")).toBeInTheDocument();
  });

  it("shows input field when accept=false", () => {
    render(<CardComponent {...defaultProps} accept={false} />);
    expect(screen.getByPlaceholderText("Type the translation...")).toBeInTheDocument();
  });

  it("shows Check button when accept=false", () => {
    render(<CardComponent {...defaultProps} accept={false} />);
    expect(screen.getByRole("button", { name: /check/i })).toBeInTheDocument();
  });

  it("calls acceptCard when Check button is clicked", () => {
    const acceptCard = vi.fn();
    render(<CardComponent {...defaultProps} accept={false} acceptCard={acceptCard} />);
    fireEvent.click(screen.getByRole("button", { name: /check/i }));
    expect(acceptCard).toHaveBeenCalledTimes(1);
  });

  it("shows front word and translation when accept=true", () => {
    render(<CardComponent {...defaultProps} accept={true} />);
    expect(screen.getByText("persistent")).toBeInTheDocument();
    expect(screen.getByText("настійливий")).toBeInTheDocument();
  });

  it("shows Next card button when accept=true", () => {
    render(<CardComponent {...defaultProps} accept={true} />);
    expect(screen.getByRole("button", { name: /next card/i })).toBeInTheDocument();
  });

  it("calls reloadCard when Next card button is clicked", () => {
    const reloadCard = vi.fn();
    render(<CardComponent {...defaultProps} accept={true} reloadCard={reloadCard} />);
    fireEvent.click(screen.getByRole("button", { name: /next card/i }));
    expect(reloadCard).toHaveBeenCalledTimes(1);
  });

  it("shows Correct! when accept=true and isCorrect=true", () => {
    render(<CardComponent {...defaultProps} accept={true} isCorrect={true} />);
    expect(screen.getByText("Correct!")).toBeInTheDocument();
  });

  it("shows Wrong when accept=true and isCorrect=false", () => {
    render(<CardComponent {...defaultProps} accept={true} isCorrect={false} />);
    expect(screen.getByText("Wrong")).toBeInTheDocument();
  });

  it("does not show correct/wrong text when isCorrect=null", () => {
    render(<CardComponent {...defaultProps} accept={true} isCorrect={null} />);
    expect(screen.queryByText("Correct!")).not.toBeInTheDocument();
    expect(screen.queryByText("Wrong")).not.toBeInTheDocument();
  });

  it("calls setText when user types in input", () => {
    const setText = vi.fn();
    render(<CardComponent {...defaultProps} accept={false} setText={setText} />);
    fireEvent.change(screen.getByPlaceholderText("Type the translation..."), {
      target: { value: "настійливий" },
    });
    expect(setText).toHaveBeenCalledWith("настійливий");
  });

  it("displays current text value in the input", () => {
    render(<CardComponent {...defaultProps} accept={false} text="current input" />);
    expect(screen.getByPlaceholderText("Type the translation...")).toHaveValue("current input");
  });

  it("hides input when accept=true", () => {
    render(<CardComponent {...defaultProps} accept={true} />);
    expect(screen.queryByPlaceholderText("Type the translation...")).not.toBeInTheDocument();
  });
});

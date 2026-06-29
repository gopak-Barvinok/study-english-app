import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import SetLanguageComponent from "@/components/SetLanguageComponent";

const defaultProps = {
  pageIsReady: vi.fn(),
  choosedLanguages: [{ language: "", level: "" }],
  languageChange: vi.fn(),
  levelChange: vi.fn(),
  addLanguage: vi.fn(),
  removeLanguage: vi.fn(),
};

describe("SetLanguageComponent", () => {
  it("renders heading", () => {
    render(<SetLanguageComponent {...defaultProps} />);
    expect(screen.getByText("Choose your languages")).toBeInTheDocument();
  });

  it("renders language select dropdown", () => {
    render(<SetLanguageComponent {...defaultProps} />);
    const selects = screen.getAllByRole("combobox");
    expect(selects.length).toBeGreaterThan(0);
  });

  it("calls languageChange when language is selected", () => {
    const languageChange = vi.fn();
    render(<SetLanguageComponent {...defaultProps} languageChange={languageChange} />);

    const select = screen.getAllByRole("combobox")[0];
    fireEvent.change(select, { target: { value: "English" } });
    expect(languageChange).toHaveBeenCalledWith(0, "English");
  });

  it("shows level select when a language is chosen", () => {
    render(
      <SetLanguageComponent
        {...defaultProps}
        choosedLanguages={[{ language: "English", level: "" }]}
      />
    );
    const selects = screen.getAllByRole("combobox");
    expect(selects.length).toBe(2);
  });

  it("calls levelChange when level is selected", () => {
    const levelChange = vi.fn();
    render(
      <SetLanguageComponent
        {...defaultProps}
        levelChange={levelChange}
        choosedLanguages={[{ language: "English", level: "" }]}
      />
    );

    const selects = screen.getAllByRole("combobox");
    fireEvent.change(selects[1], { target: { value: "B2" } });
    expect(levelChange).toHaveBeenCalledWith(0, "B2");
  });

  it("shows remove button when language and level are both set", () => {
    render(
      <SetLanguageComponent
        {...defaultProps}
        choosedLanguages={[{ language: "English", level: "B2" }]}
      />
    );
    expect(screen.getByText("✕")).toBeInTheDocument();
  });

  it("calls removeLanguage when remove button clicked", () => {
    const removeLanguage = vi.fn();
    render(
      <SetLanguageComponent
        {...defaultProps}
        removeLanguage={removeLanguage}
        choosedLanguages={[{ language: "English", level: "B2" }]}
      />
    );
    fireEvent.click(screen.getByText("✕"));
    expect(removeLanguage).toHaveBeenCalledWith(0);
  });

  it("shows Add another language button when all languages are complete", () => {
    render(
      <SetLanguageComponent
        {...defaultProps}
        choosedLanguages={[{ language: "English", level: "B2" }]}
      />
    );
    expect(screen.getByText(/add another language/i)).toBeInTheDocument();
  });

  it("calls addLanguage when Add button is clicked", () => {
    const addLanguage = vi.fn();
    render(
      <SetLanguageComponent
        {...defaultProps}
        addLanguage={addLanguage}
        choosedLanguages={[{ language: "English", level: "B2" }]}
      />
    );
    fireEvent.click(screen.getByText(/add another language/i));
    expect(addLanguage).toHaveBeenCalledTimes(1);
  });

  it("Continue button is disabled when languages are incomplete", () => {
    render(
      <SetLanguageComponent
        {...defaultProps}
        choosedLanguages={[{ language: "", level: "" }]}
      />
    );
    expect(screen.getByRole("button", { name: /continue/i })).toBeDisabled();
  });

  it("Continue button is enabled when all languages have language+level", () => {
    render(
      <SetLanguageComponent
        {...defaultProps}
        choosedLanguages={[{ language: "Japanese", level: "N3" }]}
      />
    );
    expect(screen.getByRole("button", { name: /continue/i })).not.toBeDisabled();
  });

  it("calls pageIsReady when Continue is clicked and form is complete", () => {
    const pageIsReady = vi.fn();
    render(
      <SetLanguageComponent
        {...defaultProps}
        pageIsReady={pageIsReady}
        choosedLanguages={[{ language: "English", level: "B2" }]}
      />
    );
    fireEvent.click(screen.getByRole("button", { name: /continue/i }));
    expect(pageIsReady).toHaveBeenCalledTimes(1);
  });

  it("does not show Add another button when language is incomplete", () => {
    render(
      <SetLanguageComponent
        {...defaultProps}
        choosedLanguages={[{ language: "English", level: "" }]}
      />
    );
    expect(screen.queryByText(/add another language/i)).not.toBeInTheDocument();
  });
});

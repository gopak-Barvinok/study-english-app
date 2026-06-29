import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import CertificateComponent from "@/components/CertificateComponent";
import ModalWindow from "@/components/modals/ModalWindow";

const baseCert = {
  name: "CELTA",
  year: "2020",
  description: "Cambridge certificate",
  scan: null as string | File | null,
};

// ─── CertificateComponent ─────────────────────────────────────────────────────
describe("CertificateComponent", () => {
  it("renders year input with correct value", () => {
    render(<CertificateComponent certificate={baseCert} onChange={vi.fn()} />);
    const input = document.querySelector("input[type='number']") as HTMLInputElement;
    expect(input).toBeInTheDocument();
    expect(input.value).toBe("2020");
  });

  it("renders name input with correct value", () => {
    render(<CertificateComponent certificate={baseCert} onChange={vi.fn()} />);
    const input = screen.getByPlaceholderText("Name of your certificate");
    expect(input).toHaveValue("CELTA");
  });

  it("renders description textarea with correct value", () => {
    render(<CertificateComponent certificate={baseCert} onChange={vi.fn()} />);
    const textarea = screen.getByPlaceholderText("Briefly describe this certificate");
    expect(textarea).toHaveValue("Cambridge certificate");
  });

  it("calls onChange when year changes", () => {
    const onChange = vi.fn();
    render(<CertificateComponent certificate={baseCert} onChange={onChange} />);
    const input = document.querySelector("input[type='number']") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "2021" } });
    expect(onChange).toHaveBeenCalledWith("year", "2021");
  });

  it("calls onChange when name changes", () => {
    const onChange = vi.fn();
    render(<CertificateComponent certificate={baseCert} onChange={onChange} />);
    fireEvent.change(screen.getByPlaceholderText("Name of your certificate"), {
      target: { value: "DELTA" },
    });
    expect(onChange).toHaveBeenCalledWith("name", "DELTA");
  });

  it("calls onChange when description changes", () => {
    const onChange = vi.fn();
    render(<CertificateComponent certificate={baseCert} onChange={onChange} />);
    fireEvent.change(screen.getByPlaceholderText("Briefly describe this certificate"), {
      target: { value: "Updated description" },
    });
    expect(onChange).toHaveBeenCalledWith("description", "Updated description");
  });

  it("shows file input when scan is null", () => {
    render(<CertificateComponent certificate={baseCert} onChange={vi.fn()} />);
    const fileInput = document.querySelector("input[type='file']");
    expect(fileInput).toBeInTheDocument();
  });

  it("shows iframe when scan is a string URL", () => {
    render(
      <CertificateComponent
        certificate={{ ...baseCert, scan: "https://example.com/cert.pdf" }}
        onChange={vi.fn()}
      />
    );
    const iframe = document.querySelector("iframe");
    expect(iframe).toBeInTheDocument();
    expect(iframe?.src).toContain("example.com");
  });

  it("renders all form labels", () => {
    render(<CertificateComponent certificate={baseCert} onChange={vi.fn()} />);
    expect(screen.getByText("Year")).toBeInTheDocument();
    expect(screen.getByText("Certificate name")).toBeInTheDocument();
    expect(screen.getByText("Description")).toBeInTheDocument();
    expect(screen.getByText("PDF scan")).toBeInTheDocument();
  });
});

// ─── ModalWindow ──────────────────────────────────────────────────────────────
describe("ModalWindow", () => {
  it("renders children content", () => {
    render(
      <ModalWindow modal={true} modalState={vi.fn()}>
        <p>Modal content</p>
      </ModalWindow>
    );
    expect(screen.getByText("Modal content")).toBeInTheDocument();
  });

  it("has modal-open class when modal=true", () => {
    const { container } = render(
      <ModalWindow modal={true} modalState={vi.fn()}>
        <p>Content</p>
      </ModalWindow>
    );
    const dialog = container.querySelector("dialog");
    expect(dialog?.className).toContain("modal-open");
  });

  it("does not have modal-open class when modal=false", () => {
    const { container } = render(
      <ModalWindow modal={false} modalState={vi.fn()}>
        <p>Content</p>
      </ModalWindow>
    );
    const dialog = container.querySelector("dialog");
    expect(dialog?.className).not.toContain("modal-open");
  });

  it("renders Close button", () => {
    render(
      <ModalWindow modal={true} modalState={vi.fn()}>
        <p>Content</p>
      </ModalWindow>
    );
    // Two buttons: "Close" (main) and "close" (backdrop) - find by exact text
    expect(screen.getByText("Close")).toBeInTheDocument();
  });

  it("calls modalState(false) when Close is clicked", () => {
    const modalState = vi.fn();
    render(
      <ModalWindow modal={true} modalState={modalState}>
        <p>Content</p>
      </ModalWindow>
    );
    fireEvent.click(screen.getByText("Close"));
    expect(modalState).toHaveBeenCalledWith(false);
  });

  it("applies custom className to modal box", () => {
    const { container } = render(
      <ModalWindow modal={true} modalState={vi.fn()} className="my-class">
        <p>Content</p>
      </ModalWindow>
    );
    const box = container.querySelector(".modal-box");
    expect(box?.className).toContain("my-class");
  });
});

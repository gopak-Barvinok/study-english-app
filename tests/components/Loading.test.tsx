import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Loading from "@/components/procedures/Loading";

describe("Loading", () => {
  it("renders loading text", () => {
    render(<Loading />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("renders loading spinner element", () => {
    const { container } = render(<Loading />);
    expect(container.querySelector(".loading.loading-spinner")).toBeInTheDocument();
  });

  it("has full-screen flex container", () => {
    const { container } = render(<Loading />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass("min-h-screen");
    expect(wrapper).toHaveClass("flex");
  });
});

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";

const mockFetchGet = vi.hoisted(() => vi.fn());
vi.mock("@/utils/utils", () => ({
  fetchGet: mockFetchGet,
}));

import SetLocationComponent from "@/components/SetLocationComponent";

beforeEach(() => {
  vi.clearAllMocks();
});

describe("SetLocationComponent", () => {
  it("renders heading", async () => {
    mockFetchGet.mockResolvedValueOnce(["Ukraine", "Germany"]);

    render(
      <SetLocationComponent
        pageIsReady={async () => {}}
        choosedCountry={null}
        toggleLocation={vi.fn()}
        toggleTimezone={vi.fn()}
      />
    );

    expect(screen.getByText("Where are you from?")).toBeInTheDocument();
  });

  it("fetches and displays countries list on mount", async () => {
    mockFetchGet.mockResolvedValueOnce(["Ukraine", "Germany", "France"]);

    render(
      <SetLocationComponent
        pageIsReady={async () => {}}
        choosedCountry={null}
        toggleLocation={vi.fn()}
        toggleTimezone={vi.fn()}
      />
    );

    await waitFor(() => {
      expect(screen.getByRole("option", { name: "Ukraine" })).toBeInTheDocument();
    });
  });

  it("calls toggleLocation when country is selected", async () => {
    mockFetchGet.mockResolvedValueOnce(["Ukraine", "Germany"]);
    const toggleLocation = vi.fn();

    render(
      <SetLocationComponent
        pageIsReady={async () => {}}
        choosedCountry={null}
        toggleLocation={toggleLocation}
        toggleTimezone={vi.fn()}
      />
    );

    await waitFor(() => screen.getByRole("option", { name: "Ukraine" }));

    const select = screen.getAllByRole("combobox")[0];
    fireEvent.change(select, { target: { value: "Ukraine" } });
    expect(toggleLocation).toHaveBeenCalledWith("Ukraine");
  });

  it("fetches timezones when choosedCountry changes", async () => {
    mockFetchGet
      .mockResolvedValueOnce(["Ukraine", "Germany"])
      .mockResolvedValueOnce(["+02:00", "+03:00"]);

    render(
      <SetLocationComponent
        pageIsReady={async () => {}}
        choosedCountry="Ukraine"
        toggleLocation={vi.fn()}
        toggleTimezone={vi.fn()}
      />
    );

    await waitFor(() => {
      expect(mockFetchGet).toHaveBeenCalledWith(
        "/api/get-timezone",
        { "X-Country": "Ukraine" }
      );
    });
  });

  it("shows timezone select when choosedCountry is set and timezones loaded", async () => {
    mockFetchGet
      .mockResolvedValueOnce(["Ukraine"])
      .mockResolvedValueOnce(["+02:00", "+03:00"]);

    render(
      <SetLocationComponent
        pageIsReady={async () => {}}
        choosedCountry="Ukraine"
        toggleLocation={vi.fn()}
        toggleTimezone={vi.fn()}
      />
    );

    await waitFor(() => {
      const selects = screen.getAllByRole("combobox");
      expect(selects.length).toBe(2);
    });
  });

  it("calls toggleTimezone when timezone is selected", async () => {
    mockFetchGet
      .mockResolvedValueOnce(["Ukraine"])
      .mockResolvedValueOnce(["+02:00", "+03:00"]);
    const toggleTimezone = vi.fn();

    render(
      <SetLocationComponent
        pageIsReady={async () => {}}
        choosedCountry="Ukraine"
        toggleLocation={vi.fn()}
        toggleTimezone={toggleTimezone}
      />
    );

    await waitFor(() => {
      const selects = screen.getAllByRole("combobox");
      return selects.length === 2;
    });

    const selects = screen.getAllByRole("combobox");
    fireEvent.change(selects[1], { target: { value: "+02:00" } });
    expect(toggleTimezone).toHaveBeenCalledWith("+02:00");
  });

  it("renders Continue button", async () => {
    mockFetchGet.mockResolvedValueOnce([]);

    render(
      <SetLocationComponent
        pageIsReady={async () => {}}
        choosedCountry={null}
        toggleLocation={vi.fn()}
        toggleTimezone={vi.fn()}
      />
    );

    expect(screen.getByRole("button", { name: /continue/i })).toBeInTheDocument();
  });
});

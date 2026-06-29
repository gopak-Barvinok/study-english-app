import { describe, it, expect, vi, beforeEach } from "vitest";

const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);

import { GET } from "@/app/api/get-countries/route";

beforeEach(() => {
  mockFetch.mockReset();
});

const sampleCountriesData = [
  { name: { common: "Zimbabwe" } },
  { name: { common: "Austria" } },
  { name: { common: "Brazil" } },
];

describe("GET /api/get-countries", () => {
  it("returns sorted list of country names", async () => {
    mockFetch.mockResolvedValueOnce({
      json: async () => sampleCountriesData,
    });

    const response = await GET();
    const json = await response.json();

    expect(json).toEqual(["Austria", "Brazil", "Zimbabwe"]);
  });

  it("sorts alphabetically (localeCompare)", async () => {
    const data = [
      { name: { common: "Åland Islands" } },
      { name: { common: "Afghanistan" } },
      { name: { common: "Albania" } },
    ];
    mockFetch.mockResolvedValueOnce({
      json: async () => data,
    });

    const response = await GET();
    const json = await response.json();

    expect(json[0]).toBe("Afghanistan");
  });

  it("fetches from the correct URL with revalidation", async () => {
    mockFetch.mockResolvedValueOnce({
      json: async () => [],
    });

    await GET();

    expect(mockFetch).toHaveBeenCalledWith(
      "https://raw.githubusercontent.com/mledoze/countries/master/countries.json",
      { next: { revalidate: 86400 } }
    );
  });

  it("returns empty array when no countries data", async () => {
    mockFetch.mockResolvedValueOnce({
      json: async () => [],
    });

    const response = await GET();
    const json = await response.json();

    expect(json).toEqual([]);
  });
});

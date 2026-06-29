import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

const { mockFetchGet, mockGetUtcOffsets } = vi.hoisted(() => ({
  mockFetchGet: vi.fn(),
  mockGetUtcOffsets: vi.fn(),
}));

vi.mock("@/utils/utils", () => ({ fetchGet: mockFetchGet }));
vi.mock("@/scripts/server", () => ({ getUtcOffsets: mockGetUtcOffsets }));

import { GET } from "@/app/api/get-timezone/route";

beforeEach(() => {
  vi.clearAllMocks();
});

const sampleCountriesList = [
  { name: { common: "Germany" }, cca2: "DE" },
];

describe("GET /api/get-timezone", () => {
  it("returns timezone offsets for a valid country", async () => {
    mockFetchGet.mockResolvedValueOnce(sampleCountriesList);
    mockGetUtcOffsets.mockReturnValueOnce(["+01:00", "+02:00"]);

    const req = new NextRequest("http://localhost/api/get-timezone", {
      headers: { "X-Country": "Germany" },
    });
    const response = await GET(req);
    const json = await response.json();

    expect(json).toEqual(["+01:00", "+02:00"]);
    expect(mockFetchGet).toHaveBeenCalledWith(
      "https://raw.githubusercontent.com/mledoze/countries/master/countries.json"
    );
    expect(mockGetUtcOffsets).toHaveBeenCalledWith(sampleCountriesList, "Germany");
  });

  it("returns empty array for unknown country", async () => {
    mockFetchGet.mockResolvedValueOnce(sampleCountriesList);
    mockGetUtcOffsets.mockReturnValueOnce([]);

    const req = new NextRequest("http://localhost/api/get-timezone", {
      headers: { "X-Country": "Narnia" },
    });
    const response = await GET(req);
    const json = await response.json();

    expect(json).toEqual([]);
  });

  it("returns 404 status when fetchGet throws", async () => {
    mockFetchGet.mockRejectedValueOnce(new Error("Network error"));

    const req = new NextRequest("http://localhost/api/get-timezone", {
      headers: { "X-Country": "Germany" },
    });
    const response = await GET(req);
    const json = await response.json();

    expect(json.status).toBe(404);
  });
});

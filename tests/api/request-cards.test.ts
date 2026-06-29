import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

vi.mock("@/lib/database", () => ({
  requestGeneratedCards: vi.fn(),
}));

import { GET } from "@/app/api/request-cards/route";
import { requestGeneratedCards } from "@/lib/database";

const mockRequestCards = requestGeneratedCards as ReturnType<typeof vi.fn>;

beforeEach(() => {
  vi.clearAllMocks();
});

describe("GET /api/request-cards", () => {
  it("returns cards for the given userId", async () => {
    const cards = [
      { id: "c1", front: "word", back: "definition" },
    ];
    mockRequestCards.mockResolvedValueOnce(cards);

    const req = new NextRequest("http://localhost/api/request-cards", {
      headers: { "X-User-Id": "u1" },
    });
    const response = await GET(req);
    const json = await response.json();

    expect(json).toEqual(cards);
    expect(mockRequestCards).toHaveBeenCalledWith("u1");
  });

  it("returns status 500 when X-User-Id is missing", async () => {
    const req = new NextRequest("http://localhost/api/request-cards");
    const response = await GET(req);
    const json = await response.json();

    expect(json.status).toBe(500);
    expect(mockRequestCards).not.toHaveBeenCalled();
  });

  it("returns empty array when no cards", async () => {
    mockRequestCards.mockResolvedValueOnce([]);

    const req = new NextRequest("http://localhost/api/request-cards", {
      headers: { "X-User-Id": "u1" },
    });
    const response = await GET(req);
    const json = await response.json();

    expect(json).toEqual([]);
  });
});

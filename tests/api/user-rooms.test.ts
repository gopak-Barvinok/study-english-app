import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

vi.mock("@/lib/database", () => ({
  getUserRooms: vi.fn(),
}));

import { GET } from "@/app/api/user-rooms/route";
import { getUserRooms } from "@/lib/database";

const mockGetUserRooms = getUserRooms as ReturnType<typeof vi.fn>;

beforeEach(() => {
  vi.clearAllMocks();
});

describe("GET /api/user-rooms", () => {
  it("returns rooms for the given userId", async () => {
    const rooms = [
      { room_id: "r1", slot: "Mon 10:00", participants: [{ id: "u1" }] },
    ];
    mockGetUserRooms.mockResolvedValueOnce(rooms);

    const req = new NextRequest("http://localhost/api/user-rooms", {
      headers: { "X-User-Id": "u1" },
    });
    const response = await GET(req);
    const json = await response.json();

    expect(json).toEqual(rooms);
    expect(mockGetUserRooms).toHaveBeenCalledWith("u1");
  });

  it("returns 400 error when X-User-Id header is missing", async () => {
    const req = new NextRequest("http://localhost/api/user-rooms");
    const response = await GET(req);
    const json = await response.json();

    expect(json.error).toBe("No user id");
    expect(response.status).toBe(400);
    expect(mockGetUserRooms).not.toHaveBeenCalled();
  });

  it("returns empty array when user has no rooms", async () => {
    mockGetUserRooms.mockResolvedValueOnce([]);

    const req = new NextRequest("http://localhost/api/user-rooms", {
      headers: { "X-User-Id": "u2" },
    });
    const response = await GET(req);
    const json = await response.json();

    expect(json).toEqual([]);
  });
});

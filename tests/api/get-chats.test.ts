import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

vi.mock("@/lib/database", () => ({
  getChats: vi.fn(),
}));

import { GET } from "@/app/api/get-chats/route";
import { getChats } from "@/lib/database";

const mockGetChats = getChats as ReturnType<typeof vi.fn>;

beforeEach(() => {
  vi.clearAllMocks();
});

describe("GET /api/get-chats", () => {
  it("returns array of chat IDs for user", async () => {
    const chats = [
      { id: "chat-1", messages: [], participants: [] },
      { id: "chat-2", messages: [], participants: [] },
    ];
    mockGetChats.mockResolvedValueOnce(chats);

    const req = new NextRequest("http://localhost/api/get-chats", {
      headers: { "X-User-Id": "u1" },
    });
    const response = await GET(req);
    const json = await response.json();

    expect(json).toEqual(["chat-1", "chat-2"]);
    expect(mockGetChats).toHaveBeenCalledWith("u1");
  });

  it("returns empty array when user has no chats", async () => {
    mockGetChats.mockResolvedValueOnce([]);

    const req = new NextRequest("http://localhost/api/get-chats", {
      headers: { "X-User-Id": "u2" },
    });
    const response = await GET(req);
    const json = await response.json();

    expect(json).toEqual([]);
  });
});

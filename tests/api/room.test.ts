import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

vi.mock("@/lib/database", () => ({
  requestRoomParticipants: vi.fn(),
  createRoom: vi.fn(),
}));

import { GET, POST } from "@/app/api/room/route";
import { requestRoomParticipants, createRoom } from "@/lib/database";

const mockRequest = requestRoomParticipants as ReturnType<typeof vi.fn>;
const mockCreate = createRoom as ReturnType<typeof vi.fn>;

beforeEach(() => {
  vi.clearAllMocks();
});

describe("GET /api/room", () => {
  it("returns participant IDs from rooms", async () => {
    const rooms = [
      { room_id: "r1", participants: [{ id: "u1" }, { id: "u2" }] },
    ];
    mockRequest.mockResolvedValueOnce(rooms);

    const req = new NextRequest("http://localhost/api/room", {
      headers: { "X-Room-Id": "r1" },
    });
    const response = await GET(req);
    const json = await response.json();

    expect(json.participants_id).toEqual(["u1", "u2"]);
    expect(mockRequest).toHaveBeenCalledWith("r1");
  });

  it("returns empty participants_id when room has no participants", async () => {
    mockRequest.mockResolvedValueOnce([{ room_id: "r1", participants: [] }]);

    const req = new NextRequest("http://localhost/api/room", {
      headers: { "X-Room-Id": "r1" },
    });
    const response = await GET(req);
    const json = await response.json();

    expect(json.participants_id).toEqual([]);
  });

  it("returns 500 error when database throws", async () => {
    mockRequest.mockRejectedValueOnce(new Error("DB error"));

    const req = new NextRequest("http://localhost/api/room", {
      headers: { "X-Room-Id": "r1" },
    });
    const response = await GET(req);
    const json = await response.json();

    expect(json.status).toBe(500);
  });

  it("flattens participants from multiple rooms", async () => {
    const rooms = [
      { room_id: "r1", participants: [{ id: "u1" }] },
      { room_id: "r1", participants: [{ id: "u2" }, { id: "u3" }] },
    ];
    mockRequest.mockResolvedValueOnce(rooms);

    const req = new NextRequest("http://localhost/api/room", {
      headers: { "X-Room-Id": "r1" },
    });
    const response = await GET(req);
    const json = await response.json();

    expect(json.participants_id).toEqual(["u1", "u2", "u3"]);
  });
});

describe("POST /api/room", () => {
  it("creates a room and returns 200", async () => {
    mockCreate.mockResolvedValueOnce(undefined);

    const req = new NextRequest("http://localhost/api/room", {
      method: "POST",
      body: JSON.stringify({
        room_id: "r1",
        participants_id: ["u1", "u2"],
        created_at: "Mon 09:00",
      }),
      headers: { "Content-Type": "application/json" },
    });
    const response = await POST(req);
    const json = await response.json();

    expect(json.status).toBe(200);
    expect(mockCreate).toHaveBeenCalledWith("r1", ["u1", "u2"], "Mon 09:00");
  });

  it("returns 500 error when createRoom throws", async () => {
    mockCreate.mockRejectedValueOnce(new Error("fail"));

    const req = new NextRequest("http://localhost/api/room", {
      method: "POST",
      body: JSON.stringify({ room_id: "r1", participants_id: [], created_at: "" }),
      headers: { "Content-Type": "application/json" },
    });
    const response = await POST(req);
    const json = await response.json();

    expect(json.status).toBe(500);
  });
});

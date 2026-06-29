import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

vi.mock("@/lib/database", () => ({
  createRoom: vi.fn(),
  updateScheduleInDatabase: vi.fn(),
}));

import { POST } from "@/app/api/create-room/route";
import { createRoom } from "@/lib/database";

const mockCreateRoom = createRoom as ReturnType<typeof vi.fn>;

beforeEach(() => {
  vi.clearAllMocks();
});

describe("POST /api/create-room", () => {
  it("creates a room and returns success status", async () => {
    mockCreateRoom.mockResolvedValueOnce(undefined);

    const req = new NextRequest("http://localhost/api/create-room", {
      method: "POST",
      body: JSON.stringify({
        roomId: "room-abc",
        participants: ["u1", "u2"],
        slot: "Tuesday 14:00",
      }),
      headers: { "Content-Type": "application/json" },
    });
    const response = await POST(req);
    const json = await response.json();

    expect(json.status).toBe("success");
    expect(mockCreateRoom).toHaveBeenCalledWith("room-abc", ["u1", "u2"], "Tuesday 14:00");
  });

  it("calls createRoom with correct arguments", async () => {
    mockCreateRoom.mockResolvedValueOnce(undefined);

    const req = new NextRequest("http://localhost/api/create-room", {
      method: "POST",
      body: JSON.stringify({ roomId: "r2", participants: ["u3"], slot: "Fri 16:00" }),
      headers: { "Content-Type": "application/json" },
    });
    await POST(req);

    expect(mockCreateRoom).toHaveBeenCalledWith("r2", ["u3"], "Fri 16:00");
  });
});

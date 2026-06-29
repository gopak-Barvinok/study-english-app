import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

vi.mock("@/lib/database", () => ({
  addTeacherRating: vi.fn(),
}));

import { POST } from "@/app/api/rate-lessons/route";
import { addTeacherRating } from "@/lib/database";

const mockAddRating = addTeacherRating as ReturnType<typeof vi.fn>;

beforeEach(() => {
  vi.clearAllMocks();
});

function makeRequest(body: object) {
  return new NextRequest("http://localhost/api/rate-lessons", {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  });
}

describe("POST /api/rate-lessons", () => {
  it("adds rating and returns ok", async () => {
    mockAddRating.mockResolvedValueOnce(undefined);

    const req = makeRequest({ teacherId: "t1", rating: 5, comment: "Great!" });
    const response = await POST(req);
    const json = await response.json();

    expect(json.status).toBe("ok");
    expect(mockAddRating).toHaveBeenCalledWith("t1", 5, "Great!");
  });

  it("returns 400 when teacherId is missing", async () => {
    const req = makeRequest({ rating: 5 });
    const response = await POST(req);
    const json = await response.json();

    expect(response.status).toBe(400);
    expect(json.error).toBe("Missing fields");
    expect(mockAddRating).not.toHaveBeenCalled();
  });

  it("returns 400 when rating is missing", async () => {
    const req = makeRequest({ teacherId: "t1" });
    const response = await POST(req);
    const json = await response.json();

    expect(response.status).toBe(400);
    expect(json.error).toBe("Missing fields");
  });

  it("uses empty string comment when comment is not provided", async () => {
    mockAddRating.mockResolvedValueOnce(undefined);

    const req = makeRequest({ teacherId: "t1", rating: 4 });
    const response = await POST(req);

    expect(mockAddRating).toHaveBeenCalledWith("t1", 4, "");
  });
});

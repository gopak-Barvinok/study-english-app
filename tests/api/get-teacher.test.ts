import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

vi.mock("@/lib/database", () => ({
  getTeacherFromDatabase: vi.fn(),
}));

import { GET } from "@/app/api/get-teacher/route";
import { getTeacherFromDatabase } from "@/lib/database";

const mockGetTeacher = getTeacherFromDatabase as ReturnType<typeof vi.fn>;

beforeEach(() => {
  vi.clearAllMocks();
});

describe("GET /api/get-teacher", () => {
  it("returns teacher data when found", async () => {
    const teacher = { id: "t1", certificates: [], user: { name: "Alice" } };
    mockGetTeacher.mockResolvedValueOnce(teacher);

    const req = new NextRequest("http://localhost/api/get-teacher", {
      headers: { "X-Teacher-Id": "t1" },
    });
    const response = await GET(req);
    const json = await response.json();

    expect(json).toEqual(teacher);
    expect(mockGetTeacher).toHaveBeenCalledWith("t1");
  });

  it("returns null when teacher not found", async () => {
    mockGetTeacher.mockResolvedValueOnce(null);

    const req = new NextRequest("http://localhost/api/get-teacher", {
      headers: { "X-Teacher-Id": "nonexistent" },
    });
    const response = await GET(req);
    const json = await response.json();

    expect(json).toBeNull();
  });

  it("returns error object when database throws", async () => {
    const error = new Error("DB failure");
    mockGetTeacher.mockRejectedValueOnce(error);

    const req = new NextRequest("http://localhost/api/get-teacher", {
      headers: { "X-Teacher-Id": "t1" },
    });
    const response = await GET(req);
    const json = await response.json();

    expect(json).toHaveProperty("error");
  });
});

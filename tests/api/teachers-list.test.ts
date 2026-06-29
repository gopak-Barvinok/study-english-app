import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

vi.mock("@/lib/database", () => ({
  requestTeachersList: vi.fn(),
}));

import { GET } from "@/app/api/teachers-list/route";
import { requestTeachersList } from "@/lib/database";

const mockList = requestTeachersList as ReturnType<typeof vi.fn>;

beforeEach(() => {
  vi.clearAllMocks();
});

describe("GET /api/teachers-list", () => {
  it("returns list of teachers excluding current user", async () => {
    const teachers = [
      { id: "t1", user: { name: "Alice" }, certificates: [] },
      { id: "t2", user: { name: "Bob" }, certificates: [] },
    ];
    mockList.mockResolvedValueOnce(teachers);

    const req = new NextRequest("http://localhost/api/teachers-list", {
      headers: { "X-Current-User-Id": "u0" },
    });
    const response = await GET(req);
    const json = await response.json();

    expect(json).toEqual(teachers);
    expect(mockList).toHaveBeenCalledWith("u0");
  });

  it("returns empty array when no teachers found", async () => {
    mockList.mockResolvedValueOnce([]);

    const req = new NextRequest("http://localhost/api/teachers-list", {
      headers: { "X-Current-User-Id": "u0" },
    });
    const response = await GET(req);
    const json = await response.json();

    expect(json).toEqual([]);
  });
});

import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

vi.mock("@/lib/database", () => ({
  getUserById: vi.fn(),
  updateUserInDatabase: vi.fn(),
  createNewLanguages: vi.fn(),
}));

import { GET, POST } from "@/app/api/user-params/route";
import { getUserById, updateUserInDatabase, createNewLanguages } from "@/lib/database";

const mockGetUserById = getUserById as ReturnType<typeof vi.fn>;
const mockUpdateUser = updateUserInDatabase as ReturnType<typeof vi.fn>;
const mockCreateLanguages = createNewLanguages as ReturnType<typeof vi.fn>;

beforeEach(() => {
  vi.clearAllMocks();
});

function makeGetRequest(userId: string) {
  return new NextRequest("http://localhost/api/user-params", {
    method: "GET",
    headers: { "X-User-Id": userId },
  });
}

function makePostRequest(body: object) {
  return new NextRequest("http://localhost/api/user-params", {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  });
}

describe("GET /api/user-params", () => {
  it("returns user data for given userId", async () => {
    const user = { id: "u1", email: "test@test.com", languages: [] };
    mockGetUserById.mockResolvedValueOnce(user);

    const req = makeGetRequest("u1");
    const response = await GET(req);
    const json = await response.json();

    expect(json).toEqual(user);
    expect(mockGetUserById).toHaveBeenCalledWith("u1");
  });

  it("returns null when user not found", async () => {
    mockGetUserById.mockResolvedValueOnce(null);

    const req = makeGetRequest("nonexistent");
    const response = await GET(req);
    const json = await response.json();

    expect(json).toBeNull();
  });
});

describe("POST /api/user-params", () => {
  it("updates user and creates languages, returns 200", async () => {
    mockUpdateUser.mockResolvedValueOnce({});
    mockCreateLanguages.mockResolvedValueOnce({});

    const body = {
      id: "u1",
      params: {
        name: "John",
        languages: [{ language: "English", level: "B2" }],
      },
    };
    const req = makePostRequest(body);
    const response = await POST(req);
    const json = await response.json();

    expect(json.status).toBe(200);
    expect(mockUpdateUser).toHaveBeenCalledWith("u1", { name: "John" });
    expect(mockCreateLanguages).toHaveBeenCalledWith("u1", [
      { language: "English", level: "B2" },
    ]);
  });

  it("handles empty languages array", async () => {
    mockUpdateUser.mockResolvedValueOnce({});
    mockCreateLanguages.mockResolvedValueOnce({});

    const body = { id: "u1", params: { name: "John", languages: [] } };
    const req = makePostRequest(body);
    const response = await POST(req);
    const json = await response.json();

    expect(json.status).toBe(200);
    expect(mockCreateLanguages).toHaveBeenCalledWith("u1", []);
  });
});

import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

import { POST } from "@/app/api/generate-token/route";

beforeEach(() => {
  process.env.NEXT_PUBLIC_STREAM_API_KEY = "test-api-key";
  process.env.STREAM_SECRET = "test-secret";
});

function makeRequest(body: object) {
  return new NextRequest("http://localhost/api/generate-token", {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  });
}

describe("POST /api/generate-token", () => {
  it("returns a token string and apiKey on success", async () => {
    const req = makeRequest({ userId: "u1" });
    const response = await POST(req);
    const json = await response.json();

    expect(typeof json.token).toBe("string");
    expect(json.token.length).toBeGreaterThan(0);
    expect(json.apiKey).toBe("test-api-key");
  });

  it("returns 400 when userId is missing", async () => {
    const req = makeRequest({});
    const response = await POST(req);
    const json = await response.json();

    expect(response.status).toBe(400);
    expect(json.error).toBe("User ID is required");
  });

  it("returns 400 when userId is empty string", async () => {
    const req = makeRequest({ userId: "" });
    const response = await POST(req);
    const json = await response.json();

    expect(response.status).toBe(400);
    expect(json.error).toBe("User ID is required");
  });

  it("returns 500 when Stream API key is missing", async () => {
    delete process.env.NEXT_PUBLIC_STREAM_API_KEY;
    delete process.env.STREAM_SECRET;

    const req = makeRequest({ userId: "u1" });
    const response = await POST(req);
    const json = await response.json();

    expect(response.status).toBe(500);
    expect(json.error).toBe("Failed to generate token");
  });

  it("returns correct apiKey matching env variable", async () => {
    process.env.NEXT_PUBLIC_STREAM_API_KEY = "my-custom-key";
    const req = makeRequest({ userId: "u1" });
    const response = await POST(req);
    const json = await response.json();

    expect(json.apiKey).toBe("my-custom-key");
  });

  it("generates different token for different users", async () => {
    const req1 = makeRequest({ userId: "user-a" });
    const req2 = makeRequest({ userId: "user-b" });

    const [r1, r2] = await Promise.all([POST(req1), POST(req2)]);
    const [j1, j2] = await Promise.all([r1.json(), r2.json()]);

    expect(j1.token).not.toBe(j2.token);
  });
});

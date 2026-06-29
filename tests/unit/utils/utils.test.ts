import { describe, it, expect, vi, beforeEach } from "vitest";
import { fetchGet, fetchPost } from "@/utils/utils";

const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);

beforeEach(() => {
  mockFetch.mockReset();
});

describe("fetchGet", () => {
  it("returns parsed JSON on successful response", async () => {
    const data = { name: "test" };
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => data,
    });

    const result = await fetchGet("/api/user-params");
    expect(result).toEqual(data);
    expect(mockFetch).toHaveBeenCalledWith("/api/user-params", {
      method: "GET",
      headers: {},
    });
  });

  it("sends custom headers when provided", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({}),
    });

    await fetchGet("/api/user-params", { "X-User-Id": "user-1" });
    expect(mockFetch).toHaveBeenCalledWith("/api/user-params", {
      method: "GET",
      headers: { "X-User-Id": "user-1" },
    });
  });

  it("throws an error when response is not ok", async () => {
    mockFetch.mockResolvedValueOnce({ ok: false });

    await expect(fetchGet("/api/broken")).rejects.toThrow(
      "Request troubles: /api/broken"
    );
  });

  it("works without headers argument", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ["item1", "item2"],
    });

    const result = await fetchGet("/api/list");
    expect(result).toEqual(["item1", "item2"]);
  });
});

describe("fetchPost", () => {
  it("returns parsed JSON on successful POST", async () => {
    const responseData = { status: 200 };
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => responseData,
    });

    const body = { id: "user-1", data: "value" };
    const result = await fetchPost("/api/user-params", body);

    expect(result).toEqual(responseData);
    expect(mockFetch).toHaveBeenCalledWith("/api/user-params", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  });

  it("serializes body to JSON string", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({}),
    });

    const body = { nested: { key: "value" }, arr: [1, 2, 3] };
    await fetchPost("/api/data", body);

    const callArgs = mockFetch.mock.calls[0][1];
    expect(callArgs.body).toBe(JSON.stringify(body));
  });

  it("throws an error when response is not ok", async () => {
    mockFetch.mockResolvedValueOnce({ ok: false });

    await expect(fetchPost("/api/broken", {})).rejects.toThrow(
      "Request troubles: /api/broken"
    );
  });

  it("sends Content-Type application/json header", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({}),
    });

    await fetchPost("/api/data", { key: "val" });
    const headers = mockFetch.mock.calls[0][1].headers;
    expect(headers["Content-Type"]).toBe("application/json");
  });
});

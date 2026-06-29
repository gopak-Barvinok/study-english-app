import { describe, it, expect, vi, beforeEach } from "vitest";

const { mockFetchGet, mockFetchPost } = vi.hoisted(() => ({
  mockFetchGet: vi.fn(),
  mockFetchPost: vi.fn(),
}));

vi.mock("@/utils/utils", () => ({
  fetchGet: mockFetchGet,
  fetchPost: mockFetchPost,
}));

import { useUserStore } from "@/store/userStore";

beforeEach(() => {
  vi.clearAllMocks();
  useUserStore.setState({ user: null });
});

describe("useUserStore – loadUser", () => {
  it("sets user when fetchGet succeeds", async () => {
    const userData = { id: "u1", email: "test@test.com", name: "Test" };
    mockFetchGet.mockResolvedValueOnce(userData);

    await useUserStore.getState().loadUser("u1");

    expect(useUserStore.getState().user).toEqual(userData);
    expect(mockFetchGet).toHaveBeenCalledWith("/api/user-params", {
      "X-User-Id": "u1",
    });
  });

  it("does not throw and logs error when fetchGet fails", async () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    mockFetchGet.mockRejectedValueOnce(new Error("Network error"));

    await expect(useUserStore.getState().loadUser("u1")).resolves.toBeUndefined();
    expect(consoleSpy).toHaveBeenCalled();
    expect(useUserStore.getState().user).toBeNull();

    consoleSpy.mockRestore();
  });

  it("user remains null when API fails", async () => {
    mockFetchGet.mockRejectedValueOnce(new Error("fail"));
    vi.spyOn(console, "error").mockImplementation(() => {});
    await useUserStore.getState().loadUser("u1");
    expect(useUserStore.getState().user).toBeNull();
  });
});

describe("useUserStore – updateUser", () => {
  it("returns early when user is not loaded", async () => {
    useUserStore.setState({ user: null });

    await useUserStore.getState().updateUser({ name: "Updated" });

    expect(mockFetchPost).not.toHaveBeenCalled();
  });

  it("optimistically updates user state", async () => {
    useUserStore.setState({ user: { id: "u1", name: "Old" } });
    mockFetchPost.mockResolvedValueOnce({ status: 200 });

    await useUserStore.getState().updateUser({ name: "New" });

    expect(useUserStore.getState().user?.name).toBe("New");
  });

  it("sends updated data to the API", async () => {
    useUserStore.setState({ user: { id: "u1", name: "Old" } });
    mockFetchPost.mockResolvedValueOnce({ status: 200 });

    await useUserStore.getState().updateUser({ name: "New" });

    expect(mockFetchPost).toHaveBeenCalledWith("/api/user-params", {
      id: "u1",
      params: { name: "New" },
    });
  });

  it("reloads user from server when API returns non-200", async () => {
    const reloadedUser = { id: "u1", name: "FromServer" };
    useUserStore.setState({ user: { id: "u1", name: "Old" } });
    mockFetchPost.mockResolvedValueOnce({ status: 500 });
    mockFetchGet.mockResolvedValueOnce(reloadedUser);

    await useUserStore.getState().updateUser({ name: "New" });

    expect(mockFetchGet).toHaveBeenCalled();
    expect(useUserStore.getState().user).toEqual(reloadedUser);
  });

  it("does not reload when API returns 200", async () => {
    useUserStore.setState({ user: { id: "u1", name: "Old" } });
    mockFetchPost.mockResolvedValueOnce({ status: 200 });

    await useUserStore.getState().updateUser({ name: "New" });

    expect(mockFetchGet).not.toHaveBeenCalled();
  });

  it("merges new data with existing user fields", async () => {
    useUserStore.setState({ user: { id: "u1", name: "Old", email: "a@b.com" } });
    mockFetchPost.mockResolvedValueOnce({ status: 200 });

    await useUserStore.getState().updateUser({ name: "New" });

    const user = useUserStore.getState().user;
    expect(user?.email).toBe("a@b.com");
    expect(user?.name).toBe("New");
  });
});

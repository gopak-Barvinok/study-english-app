import { describe, it, expect, vi, beforeEach } from "vitest";

// Use a container object so the reference is stable across vi.mock hoisting
const configContainer = vi.hoisted(() => ({ captured: null as any }));

const { mockGetUserByEmail, mockCreateNewUser, mockUpdateUserInDatabase } = vi.hoisted(() => ({
  mockGetUserByEmail: vi.fn(),
  mockCreateNewUser: vi.fn(),
  mockUpdateUserInDatabase: vi.fn(),
}));

vi.mock("@/lib/database", () => ({
  getUserByEmail: mockGetUserByEmail,
  createNewUser: mockCreateNewUser,
  updateUserInDatabase: mockUpdateUserInDatabase,
}));

vi.mock("next-auth/providers/google", () => ({
  default: vi.fn().mockReturnValue({ id: "google", type: "oauth" }),
}));

vi.mock("next-auth", () => ({
  default: (config: any) => {
    configContainer.captured = config;
    return {
      handlers: {},
      signIn: vi.fn(),
      signOut: vi.fn(),
      auth: vi.fn(),
    };
  },
}));

// Import auth.ts - this will call NextAuth with the config
import "@/auth";

beforeEach(() => {
  vi.clearAllMocks();
});

describe("auth.ts – NextAuth configuration", () => {
  it("exports config with Google provider", () => {
    expect(configContainer.captured).toBeTruthy();
    expect(configContainer.captured.providers).toHaveLength(1);
  });

  it("uses JWT session strategy with 24h maxAge", () => {
    expect(configContainer.captured.session.strategy).toBe("jwt");
    expect(configContainer.captured.session.maxAge).toBe(24 * 60 * 60);
  });
});

describe("auth.ts – jwt callback", () => {
  it("creates a new user when user doesn't exist", async () => {
    const newUser = { id: "new-id", email: "new@test.com" };
    mockGetUserByEmail.mockResolvedValueOnce(null);
    mockCreateNewUser.mockResolvedValueOnce(newUser);

    const token = {};
    const account = { provider: "google" };
    const profile = {
      email: "new@test.com",
      name: "New User",
      picture: "https://img.example.com/photo.jpg",
      email_verified: true,
      id: "google-id-123",
    };

    const result = await configContainer.captured.callbacks.jwt({ token, account, profile });
    expect(mockCreateNewUser).toHaveBeenCalled();
    expect(result.id).toBe("new-id");
    expect(result.email).toBe("new@test.com");
  });

  it("updates existing user when user exists", async () => {
    const existingUser = { id: "existing-id", email: "existing@test.com", name: null, image: null, emailVerified: null };
    mockGetUserByEmail.mockResolvedValueOnce(existingUser);
    mockUpdateUserInDatabase.mockResolvedValueOnce(undefined);

    const token = {};
    const account = { provider: "google" };
    const profile = {
      email: "existing@test.com",
      name: "Existing User",
      picture: "https://img.example.com/photo.jpg",
      email_verified: true,
      id: "google-id-456",
    };

    const result = await configContainer.captured.callbacks.jwt({ token, account, profile });
    expect(mockUpdateUserInDatabase).toHaveBeenCalled();
    expect(result.id).toBe("existing-id");
    expect(result.email).toBe("existing@test.com");
  });

  it("returns token unchanged when no account/profile", async () => {
    const token = { id: "u1", email: "user@test.com" };
    const result = await configContainer.captured.callbacks.jwt({ token });
    expect(result).toBe(token);
  });

  it("throws error when email is missing from profile", async () => {
    const token = {};
    const account = { provider: "google" };
    const profile = { name: "No Email User" };

    await expect(
      configContainer.captured.callbacks.jwt({ token, account, profile })
    ).rejects.toThrow("Email is not provided");
  });
});

describe("auth.ts – session callback", () => {
  it("injects user id and email into session", async () => {
    const session = { user: {} };
    const token = { id: "u1", email: "test@test.com" };

    const result = await configContainer.captured.callbacks.session({ session, token });
    expect(result.user.id).toBe("u1");
    expect(result.user.email).toBe("test@test.com");
  });
});

describe("auth.ts – signIn callback", () => {
  it("returns true when profile has email", async () => {
    const result = await configContainer.captured.callbacks.signIn({
      profile: { email: "user@test.com" },
    });
    expect(result).toBe(true);
  });

  it("returns false when profile has no email", async () => {
    const result = await configContainer.captured.callbacks.signIn({ profile: {} });
    expect(result).toBe(false);
  });

  it("returns false when profile is undefined", async () => {
    const result = await configContainer.captured.callbacks.signIn({});
    expect(result).toBe(false);
  });
});

import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";

// Mock Next.js server exports used by API routes
vi.mock("next/server", async (importOriginal) => {
  const actual = await importOriginal<typeof import("next/server")>();
  return actual;
});

// Mock dotenv/config used in some files
vi.mock("dotenv/config", () => ({}));

// Provide crypto.randomUUID globally if not present
if (!globalThis.crypto) {
  Object.defineProperty(globalThis, "crypto", {
    value: {
      randomUUID: () => "test-uuid-1234",
      getRandomValues: (arr: Uint8Array) => arr,
    },
  });
} else if (!globalThis.crypto.randomUUID) {
  Object.defineProperty(globalThis.crypto, "randomUUID", {
    value: () => "test-uuid-1234",
  });
}

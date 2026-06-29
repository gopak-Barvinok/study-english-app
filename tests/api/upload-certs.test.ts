import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

const mockUploadStream = vi.hoisted(() =>
  vi.fn().mockImplementation((_options: any, cb: any) => {
    cb(null, { secure_url: "https://cloudinary.com/cert.pdf" });
    return { end: vi.fn() };
  })
);

vi.mock("cloudinary", () => ({
  v2: {
    config: vi.fn(),
    uploader: {
      upload_stream: mockUploadStream,
    },
  },
}));

import { POST } from "@/app/api/upload-certs/route";

function makeRequest(overrideFormData?: any) {
  const file = {
    arrayBuffer: async () => Buffer.from("PDF content"),
  };
  const formData = overrideFormData ?? {
    get: vi.fn().mockReturnValue(file),
  };

  return {
    formData: async () => formData,
  } as unknown as NextRequest;
}

beforeEach(() => {
  vi.clearAllMocks();
  mockUploadStream.mockImplementation((_options: any, cb: any) => {
    cb(null, { secure_url: "https://cloudinary.com/cert.pdf" });
    return { end: vi.fn() };
  });
});

describe("POST /api/upload-certs", () => {
  it("returns secure_url on successful upload", async () => {
    const req = makeRequest();
    const response = await POST(req);
    const json = await response.json();

    expect(json.url).toBe("https://cloudinary.com/cert.pdf");
  });

  it("calls upload_stream with correct folder option", async () => {
    const req = makeRequest();
    await POST(req);

    expect(mockUploadStream).toHaveBeenCalledWith(
      expect.objectContaining({ folder: "certificates", resource_type: "auto" }),
      expect.any(Function)
    );
  });

  it("returns error object when upload fails", async () => {
    mockUploadStream.mockImplementationOnce((_opts: any, cb: any) => {
      cb(new Error("Upload failed"), null);
      return { end: vi.fn() };
    });

    const req = makeRequest();
    const response = await POST(req);
    const json = await response.json();

    expect(json).toHaveProperty("error");
  });
});

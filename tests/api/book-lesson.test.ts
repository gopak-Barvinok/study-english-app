import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

vi.mock("@/lib/database", () => ({
  createScheduleInDatabase: vi.fn(),
  findChatBetweenUsers: vi.fn(),
  createChat: vi.fn(),
}));

const { mockChannelCreate, mockChannelSendMessage, mockGetInstance } = vi.hoisted(() => {
  const mockChannelCreate = vi.fn().mockResolvedValue(undefined);
  const mockChannelSendMessage = vi.fn().mockResolvedValue(undefined);
  const mockChannel = {
    create: mockChannelCreate,
    sendMessage: mockChannelSendMessage,
  };
  const mockGetInstance = vi.fn().mockReturnValue({
    channel: vi.fn().mockReturnValue(mockChannel),
  });
  return { mockChannelCreate, mockChannelSendMessage, mockGetInstance };
});

vi.mock("stream-chat", () => ({
  StreamChat: {
    getInstance: mockGetInstance,
  },
}));

import { POST } from "@/app/api/book-lesson/route";
import {
  createScheduleInDatabase,
  findChatBetweenUsers,
  createChat,
} from "@/lib/database";

const mockCreateSchedule = createScheduleInDatabase as ReturnType<typeof vi.fn>;
const mockFindChat = findChatBetweenUsers as ReturnType<typeof vi.fn>;
const mockCreateChat = createChat as ReturnType<typeof vi.fn>;

beforeEach(() => {
  vi.clearAllMocks();
  mockChannelCreate.mockResolvedValue(undefined);
  mockChannelSendMessage.mockResolvedValue(undefined);
  process.env.NEXT_PUBLIC_STREAM_API_KEY = "api-key";
  process.env.STREAM_SECRET = "secret";
  process.env.NEXT_PUBLIC_NEXTAUTH_URL = "http://localhost:3000";
});

function makeRequest(body: object) {
  return new NextRequest("http://localhost/api/book-lesson", {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  });
}

describe("POST /api/book-lesson", () => {
  it("uses existing chat when one exists between users", async () => {
    mockCreateSchedule.mockResolvedValueOnce(undefined);
    mockFindChat.mockResolvedValueOnce({ id: "existing-chat-id" });

    const req = makeRequest({
      studentId: "s1",
      teacherId: "t1",
      schedule: ["Mon 09:00"],
    });
    const response = await POST(req);
    const json = await response.json();

    expect(json.status).toBe(200);
    expect(mockCreateChat).not.toHaveBeenCalled();
  });

  it("creates new chat when no chat exists between users", async () => {
    mockCreateSchedule.mockResolvedValueOnce(undefined);
    mockFindChat.mockResolvedValueOnce(null);
    mockCreateChat.mockResolvedValueOnce(undefined);

    const req = makeRequest({
      studentId: "s1",
      teacherId: "t1",
      schedule: ["Mon 09:00"],
    });
    const response = await POST(req);
    const json = await response.json();

    expect(json.status).toBe(200);
    expect(mockCreateChat).toHaveBeenCalled();
  });

  it("creates schedule for student", async () => {
    mockCreateSchedule.mockResolvedValueOnce(undefined);
    mockFindChat.mockResolvedValueOnce({ id: "c1" });

    const req = makeRequest({
      studentId: "s1",
      teacherId: "t1",
      schedule: ["Mon 09:00", "Tue 10:00"],
    });
    await POST(req);

    expect(mockCreateSchedule).toHaveBeenCalledWith("s1", ["Mon 09:00", "Tue 10:00"]);
  });

  it("sends a proposal message to the chat channel", async () => {
    mockCreateSchedule.mockResolvedValueOnce(undefined);
    mockFindChat.mockResolvedValueOnce({ id: "c1" });

    const req = makeRequest({
      studentId: "s1",
      teacherId: "t1",
      schedule: ["Mon 09:00"],
    });
    await POST(req);

    expect(mockChannelSendMessage).toHaveBeenCalledWith(
      expect.objectContaining({
        user_id: "s1",
        text: expect.stringContaining("Mon 09:00"),
      })
    );
  });

  it("returns error response when database fails", async () => {
    mockCreateSchedule.mockRejectedValueOnce(new Error("DB error"));

    const req = makeRequest({
      studentId: "s1",
      teacherId: "t1",
      schedule: ["Mon 09:00"],
    });
    const response = await POST(req);
    const json = await response.json();

    expect(json.error).toBeTruthy();
  });
});

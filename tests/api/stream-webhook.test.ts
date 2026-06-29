import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

vi.mock("@/lib/database", () => ({
  createAndUpdateMessages: vi.fn(),
  updateTranscribation: vi.fn(),
  inputGeneratedCards: vi.fn(),
}));

vi.mock("@/lib/groq", () => ({
  generateFlashCards: vi.fn(),
}));

const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);

import { POST } from "@/app/api/stream-webhook/route";
import {
  createAndUpdateMessages,
  updateTranscribation,
  inputGeneratedCards,
} from "@/lib/database";
import { generateFlashCards } from "@/lib/groq";

const mockCreateMsg = createAndUpdateMessages as ReturnType<typeof vi.fn>;
const mockUpdateTranscription = updateTranscribation as ReturnType<typeof vi.fn>;
const mockInputCards = inputGeneratedCards as ReturnType<typeof vi.fn>;
const mockGenerateCards = generateFlashCards as ReturnType<typeof vi.fn>;

beforeEach(() => {
  vi.clearAllMocks();
  mockFetch.mockReset();
});

function makeWebhookRequest(body: object) {
  return new NextRequest("http://localhost/api/stream-webhook", {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  });
}

describe("POST /api/stream-webhook – message.new", () => {
  it("creates message record in database", async () => {
    mockCreateMsg.mockResolvedValueOnce(undefined);

    const req = makeWebhookRequest({
      type: "message.new",
      call_cid: "default:room-1",
      channelId: "chat-1",
      message: {
        id: "msg-1",
        text: "Hello!",
        user: { id: "u1" },
        created_at: "2024-01-01T10:00:00Z",
      },
    });
    const response = await POST(req);
    const json = await response.json();

    expect(json.status).toBe(200);
    expect(mockCreateMsg).toHaveBeenCalledWith({
      id: "msg-1",
      text: "Hello!",
      chatId: "chat-1",
      senderId: "u1",
      createdAt: new Date("2024-01-01T10:00:00Z"),
    });
  });
});

describe("POST /api/stream-webhook – call.transcription_ready", () => {
  const transcriptionLines = [
    JSON.stringify({ text: "How are you?" }),
    JSON.stringify({ text: "I am fine." }),
  ].join("\n");

  it("fetches transcription, updates DB and generates flashcards", async () => {
    mockFetch.mockResolvedValueOnce({
      text: async () => transcriptionLines,
    });
    mockUpdateTranscription.mockResolvedValueOnce(undefined);
    const cards = [{ front: "fine", back: "good" }];
    mockGenerateCards.mockResolvedValueOnce(cards);
    mockInputCards.mockResolvedValueOnce(undefined);

    const req = makeWebhookRequest({
      type: "call.transcription_ready",
      call_cid: "default:room-1",
      call_transcription: { url: "http://example.com/transcript.jsonl" },
    });
    const response = await POST(req);
    const json = await response.json();

    expect(json.status).toBe(200);
    expect(mockUpdateTranscription).toHaveBeenCalledWith("room-1", [
      "How are you?",
      "I am fine.",
    ]);
    expect(mockGenerateCards).toHaveBeenCalledWith(["How are you?", "I am fine."]);
    expect(mockInputCards).toHaveBeenCalledWith("room-1", cards);
  });

  it("skips card generation when transcription is empty", async () => {
    mockFetch.mockResolvedValueOnce({
      text: async () => "\n\n",
    });
    mockUpdateTranscription.mockResolvedValueOnce(undefined);

    const req = makeWebhookRequest({
      type: "call.transcription_ready",
      call_cid: "default:room-1",
      call_transcription: { url: "http://example.com/empty.jsonl" },
    });
    await POST(req);

    expect(mockGenerateCards).not.toHaveBeenCalled();
  });

  it("filters out lines that fail JSON parsing", async () => {
    const mixedLines = [
      JSON.stringify({ text: "Valid sentence" }),
      "invalid json line",
    ].join("\n");

    mockFetch.mockResolvedValueOnce({
      text: async () => mixedLines,
    });
    mockUpdateTranscription.mockResolvedValueOnce(undefined);
    mockGenerateCards.mockResolvedValueOnce([]);
    mockInputCards.mockResolvedValueOnce(undefined);

    const req = makeWebhookRequest({
      type: "call.transcription_ready",
      call_cid: "default:room-1",
      call_transcription: { url: "http://example.com/mixed.jsonl" },
    });
    await POST(req);

    expect(mockUpdateTranscription).toHaveBeenCalledWith("room-1", ["Valid sentence"]);
  });
});

describe("POST /api/stream-webhook – other event types", () => {
  it("handles call.transcription_started without error", async () => {
    const req = makeWebhookRequest({
      type: "call.transcription_started",
      call_cid: "default:room-1",
    });
    const response = await POST(req);
    const json = await response.json();
    expect(json.status).toBe(200);
  });

  it("handles call.transcription_stopped without error", async () => {
    const req = makeWebhookRequest({
      type: "call.transcription_stopped",
      call_cid: "default:room-1",
    });
    const response = await POST(req);
    const json = await response.json();
    expect(json.status).toBe(200);
  });

  it("handles call.transcription_failed without error", async () => {
    const req = makeWebhookRequest({
      type: "call.transcription_failed",
      call_cid: "default:room-1",
    });
    const response = await POST(req);
    const json = await response.json();
    expect(json.status).toBe(200);
  });

  it("handles unknown event type gracefully", async () => {
    const req = makeWebhookRequest({
      type: "unknown.event",
      call_cid: "default:room-1",
    });
    const response = await POST(req);
    const json = await response.json();
    expect(json.status).toBe(200);
  });
});

describe("POST /api/stream-webhook – error handling", () => {
  it("returns status 500 when an exception occurs", async () => {
    mockCreateMsg.mockRejectedValueOnce(new Error("DB crash"));

    const req = makeWebhookRequest({
      type: "message.new",
      call_cid: "default:room-1",
      channelId: "chat-1",
      message: {
        id: "msg-1",
        text: "Hi",
        user: { id: "u1" },
        created_at: "2024-01-01T10:00:00Z",
      },
    });
    const response = await POST(req);
    const json = await response.json();
    expect(json.status).toBe(500);
  });
});

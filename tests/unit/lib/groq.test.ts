import { describe, it, expect, vi, beforeEach } from "vitest";

const mockCreate = vi.hoisted(() => vi.fn());

vi.mock("groq-sdk", () => ({
  default: class {
    chat = {
      completions: {
        create: mockCreate,
      },
    };
  },
}));

import { generateFlashCards } from "@/lib/groq";

const validCard = {
  front: "persistent",
  back: "continuing firmly in a course of action",
  example: "He was persistent in his questioning.",
  translation: "настійливий",
  type: "word",
};

beforeEach(() => {
  mockCreate.mockReset();
});

describe("generateFlashCards", () => {
  it("returns parsed cards array on success", async () => {
    mockCreate.mockResolvedValueOnce({
      choices: [{ message: { content: JSON.stringify({ cards: [validCard] }) } }],
    });

    const result = await generateFlashCards(["persistent"]);
    expect(result).toEqual([validCard]);
  });

  it("returns multiple cards", async () => {
    const cards = [validCard, { ...validCard, front: "resilient" }];
    mockCreate.mockResolvedValueOnce({
      choices: [{ message: { content: JSON.stringify({ cards }) } }],
    });

    const result = await generateFlashCards(["persistent", "resilient"]);
    expect(result).toHaveLength(2);
    expect(result[1].front).toBe("resilient");
  });

  it("returns empty array when responseText is null/undefined", async () => {
    mockCreate.mockResolvedValueOnce({
      choices: [{ message: { content: null } }],
    });

    const result = await generateFlashCards(["word"]);
    expect(result).toEqual([]);
  });

  it("returns empty array when responseText is empty string", async () => {
    mockCreate.mockResolvedValueOnce({
      choices: [{ message: { content: "" } }],
    });

    const result = await generateFlashCards(["word"]);
    expect(result).toEqual([]);
  });

  it("returns empty array when parsed.cards is not an array", async () => {
    mockCreate.mockResolvedValueOnce({
      choices: [
        { message: { content: JSON.stringify({ cards: "not-an-array" }) } },
      ],
    });

    const result = await generateFlashCards(["word"]);
    expect(result).toEqual([]);
  });

  it("throws when Groq API call fails", async () => {
    const error = new Error("Groq API failure");
    mockCreate.mockRejectedValueOnce(error);

    await expect(generateFlashCards(["word"])).rejects.toThrow("Groq API failure");
  });

  it("calls Groq with correct model and parameters", async () => {
    mockCreate.mockResolvedValueOnce({
      choices: [{ message: { content: JSON.stringify({ cards: [] }) } }],
    });

    await generateFlashCards(["test"]);

    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        model: "llama-3.3-70b-versatile",
        temperature: 0.3,
        response_format: { type: "json_object" },
      })
    );
  });

  it("includes texts in the prompt message", async () => {
    mockCreate.mockResolvedValueOnce({
      choices: [{ message: { content: JSON.stringify({ cards: [] }) } }],
    });

    const texts = ["word1", "word2"];
    await generateFlashCards(texts);

    const callArg = mockCreate.mock.calls[0][0];
    const userMessage = callArg.messages.find((m: any) => m.role === "user");
    expect(userMessage.content).toContain(JSON.stringify(texts));
  });
});

import { describe, it, expect } from "vitest";
import {
  gmtOffsetToString,
  returnLanguageWithLevels,
  calculateAge,
  toSetSchedule,
} from "@/scripts/client";

describe("gmtOffsetToString", () => {
  it("formats positive offset correctly", () => {
    expect(gmtOffsetToString(3600)).toBe("UTC+01:00");
  });

  it("formats zero offset correctly", () => {
    expect(gmtOffsetToString(0)).toBe("UTC+00:00");
  });

  it("formats negative offset correctly", () => {
    expect(gmtOffsetToString(-18000)).toBe("UTC-05:00");
  });

  it("formats fractional hour offset correctly", () => {
    // 5.5 hours = 19800 seconds (India)
    expect(gmtOffsetToString(19800)).toBe("UTC+05:30");
  });

  it("formats large positive offset correctly", () => {
    // UTC+12:00 = 43200 seconds
    expect(gmtOffsetToString(43200)).toBe("UTC+12:00");
  });

  it("formats large negative offset correctly", () => {
    // UTC-12:00 = -43200 seconds
    expect(gmtOffsetToString(-43200)).toBe("UTC-12:00");
  });

  it("pads single-digit hours with zero", () => {
    expect(gmtOffsetToString(7200)).toBe("UTC+02:00");
  });
});

describe("returnLanguageWithLevels", () => {
  it("returns JLPT levels for Japanese", () => {
    const levels = returnLanguageWithLevels("Japanese");
    expect(levels).toEqual(["N1", "N2", "N3", "N4", "N5", "Fluent", "Native"]);
  });

  it("returns HSK levels for Chinese", () => {
    const levels = returnLanguageWithLevels("Chinese");
    expect(levels).toEqual([
      "HSK1", "HSK2", "HSK3", "HSK4", "HSK5", "HSK6",
      "HSK7", "HSK8", "HSK9", "Fluent", "Native",
    ]);
  });

  it("returns TOPIK levels for Korean", () => {
    const levels = returnLanguageWithLevels("Korean");
    expect(levels).toEqual([
      "TOPIK1", "TOPIK2", "TOPIK3", "TOPIK4", "TOPIK5", "TOPIK6",
      "Fluent", "Native",
    ]);
  });

  it("returns CEFR levels for English", () => {
    const levels = returnLanguageWithLevels("English");
    expect(levels).toEqual(["A1", "A2", "B1", "B2", "C1", "C2", "Fluent", "Native"]);
  });

  it("returns CEFR levels for Spanish", () => {
    const levels = returnLanguageWithLevels("Spanish");
    expect(levels).toEqual(["A1", "A2", "B1", "B2", "C1", "C2", "Fluent", "Native"]);
  });

  it("returns CEFR levels for French", () => {
    const levels = returnLanguageWithLevels("French");
    expect(levels).toEqual(["A1", "A2", "B1", "B2", "C1", "C2", "Fluent", "Native"]);
  });

  it("returns CEFR levels for any unknown language", () => {
    const levels = returnLanguageWithLevels("German");
    expect(levels).toEqual(["A1", "A2", "B1", "B2", "C1", "C2", "Fluent", "Native"]);
  });

  it("includes Fluent and Native for all languages", () => {
    const languages = ["Japanese", "Chinese", "Korean", "English", "German"];
    for (const lang of languages) {
      const levels = returnLanguageWithLevels(lang);
      expect(levels).toContain("Fluent");
      expect(levels).toContain("Native");
    }
  });
});

describe("calculateAge", () => {
  it("calculates age for a past date", () => {
    // Born 30 years ago
    const thirtyYearsAgo = new Date();
    thirtyYearsAgo.setFullYear(thirtyYearsAgo.getFullYear() - 30);
    const birthDate = thirtyYearsAgo.toISOString().split("T")[0];
    expect(calculateAge(birthDate)).toBe(30);
  });

  it("returns 0 for today's date", () => {
    const today = new Date().toISOString().split("T")[0];
    expect(calculateAge(today)).toBe(0);
  });

  it("subtracts 1 when birthday has not occurred yet this year", () => {
    const today = new Date();
    // Use December 31 — reliably in the future unless test runs on Dec 31
    // Build string directly to avoid UTC timezone offset distortion
    const birthYear = today.getFullYear() - 25;
    const birthDate = `${birthYear}-12-31`;
    // If today is already Dec 31, skip this test
    if (today.getMonth() === 11 && today.getDate() === 31) return;
    expect(calculateAge(birthDate)).toBe(24);
  });

  it("counts correctly when birthday is exactly today", () => {
    const today = new Date();
    const birthDate = new Date(
      today.getFullYear() - 20,
      today.getMonth(),
      today.getDate()
    )
      .toISOString()
      .split("T")[0];
    expect(calculateAge(birthDate)).toBe(20);
  });
});

describe("toSetSchedule", () => {
  it("converts an array of schedule objects to a Set", () => {
    const schedule = [
      { slot: "Monday 09:00" },
      { slot: "Tuesday 10:00" },
    ];
    const result = toSetSchedule(schedule);
    expect(result).toBeInstanceOf(Set);
    expect(result.has("Monday 09:00")).toBe(true);
    expect(result.has("Tuesday 10:00")).toBe(true);
  });

  it("returns an empty Set for an empty array", () => {
    const result = toSetSchedule([]);
    expect(result).toBeInstanceOf(Set);
    expect(result.size).toBe(0);
  });

  it("deduplicates slots", () => {
    const schedule = [
      { slot: "Monday 09:00" },
      { slot: "Monday 09:00" },
    ];
    const result = toSetSchedule(schedule);
    expect(result.size).toBe(1);
  });

  it("handles objects with extra fields", () => {
    const schedule = [{ slot: "Friday 14:00", id: 1, userId: "u1" }];
    const result = toSetSchedule(schedule);
    expect(result.has("Friday 14:00")).toBe(true);
  });
});

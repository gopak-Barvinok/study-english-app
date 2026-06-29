import { describe, it, expect } from "vitest";
import { getCca2, getUtcOffsets } from "@/scripts/server";

const sampleCountriesList = [
  { name: { common: "Ukraine" }, cca2: "UA" },
  { name: { common: "Germany" }, cca2: "DE" },
  { name: { common: "United States" }, cca2: "US" },
  { name: { common: "Japan" }, cca2: "JP" },
  { name: { common: "Australia" }, cca2: "AU" },
];

describe("getCca2", () => {
  it("returns cca2 code for a known country (case-insensitive)", () => {
    expect(getCca2(sampleCountriesList, "Ukraine")).toBe("UA");
    expect(getCca2(sampleCountriesList, "ukraine")).toBe("UA");
    expect(getCca2(sampleCountriesList, "UKRAINE")).toBe("UA");
  });

  it("returns cca2 for Germany", () => {
    expect(getCca2(sampleCountriesList, "Germany")).toBe("DE");
  });

  it("returns cca2 for United States", () => {
    expect(getCca2(sampleCountriesList, "United States")).toBe("US");
  });

  it("returns null for an unknown country", () => {
    expect(getCca2(sampleCountriesList, "Narnia")).toBeNull();
  });

  it("returns null for empty string", () => {
    expect(getCca2(sampleCountriesList, "")).toBeNull();
  });

  it("returns null for empty countries list", () => {
    expect(getCca2([], "Ukraine")).toBeNull();
  });
});

describe("getUtcOffsets", () => {
  it("returns an array of offset strings for a valid country", () => {
    const offsets = getUtcOffsets(sampleCountriesList, "Germany");
    expect(Array.isArray(offsets)).toBe(true);
    expect(offsets.length).toBeGreaterThan(0);
  });

  it("returns sorted offsets", () => {
    const offsets = getUtcOffsets(sampleCountriesList, "Australia");
    const sorted = [...offsets].sort();
    expect(offsets).toEqual(sorted);
  });

  it("returns empty array for unknown country", () => {
    const offsets = getUtcOffsets(sampleCountriesList, "Narnia");
    expect(offsets).toEqual([]);
  });

  it("returns empty array for empty countries list", () => {
    const offsets = getUtcOffsets([], "Germany");
    expect(offsets).toEqual([]);
  });

  it("returns unique offsets (no duplicates)", () => {
    const offsets = getUtcOffsets(sampleCountriesList, "United States");
    const unique = new Set(offsets);
    expect(offsets.length).toBe(unique.size);
  });

  it("offset strings are in valid UTC format", () => {
    const offsets = getUtcOffsets(sampleCountriesList, "Germany");
    for (const offset of offsets) {
      expect(offset).toMatch(/^[+-]\d{2}:\d{2}$/);
    }
  });
});

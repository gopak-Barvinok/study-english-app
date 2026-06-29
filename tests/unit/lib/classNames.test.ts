import { describe, it, expect } from "vitest";
import {
  classNameBody,
  classNameMain,
  classNameFooter,
  getScheduleCellClass,
} from "@/lib/classNames";

describe("exported constants", () => {
  it("classNameBody is a string", () => {
    expect(typeof classNameBody).toBe("string");
    expect(classNameBody).toBe("min-h-screen flex flex-col");
  });

  it("classNameMain is a string", () => {
    expect(typeof classNameMain).toBe("string");
    expect(classNameMain).toBe("flex-1 overflow-y-auto flex flex-col py-4");
  });

  it("classNameFooter is a string", () => {
    expect(typeof classNameFooter).toBe("string");
  });
});

describe("getScheduleCellClass", () => {
  const base = "transition-colors duration-150";

  it("returns studentSelected class with clickable cursor when isStudentSelected=true and isClickable=true", () => {
    const result = getScheduleCellClass(true, false, true, "select");
    expect(result).toContain(base);
    expect(result).toContain("bg-primary/40");
    expect(result).toContain("cursor-pointer");
    expect(result).toContain("hover:bg-primary/55");
  });

  it("returns studentSelected class with default cursor when isStudentSelected=true and isClickable=false", () => {
    const result = getScheduleCellClass(true, false, false, "select");
    expect(result).toContain("bg-primary/40");
    expect(result).toContain("cursor-default");
    expect(result).not.toContain("cursor-pointer");
  });

  it("returns selected class with clickable cursor when isSelected=true and isClickable=true", () => {
    const result = getScheduleCellClass(false, true, true, "edit");
    expect(result).toContain(base);
    expect(result).toContain("bg-success/20");
    expect(result).toContain("cursor-pointer");
    expect(result).toContain("hover:bg-success/35");
  });

  it("returns selected class with default cursor when isSelected=true and isClickable=false", () => {
    const result = getScheduleCellClass(false, true, false, "edit");
    expect(result).toContain("bg-success/20");
    expect(result).toContain("cursor-default");
  });

  it("returns watch mode class when mode=watch and not selected", () => {
    const result = getScheduleCellClass(false, false, true, "watch");
    expect(result).toContain(base);
    expect(result).toContain("bg-base-300/30");
    expect(result).toContain("cursor-default");
  });

  it("returns default class with cursor-pointer when isClickable=true in non-watch mode", () => {
    const result = getScheduleCellClass(false, false, true, "edit");
    expect(result).toContain(base);
    expect(result).toContain("bg-base-300/20");
    expect(result).toContain("cursor-pointer");
    expect(result).toContain("hover:bg-success/15");
  });

  it("returns default class with cursor-default when isClickable=false in non-watch mode", () => {
    const result = getScheduleCellClass(false, false, false, "select");
    expect(result).toContain("bg-base-300/20");
    expect(result).toContain("cursor-default");
  });

  it("studentSelected takes priority over isSelected", () => {
    const result = getScheduleCellClass(true, true, true, "edit");
    expect(result).toContain("bg-primary/40");
    expect(result).not.toContain("bg-success/20");
  });

  it("isSelected takes priority over watch mode", () => {
    const result = getScheduleCellClass(false, true, false, "watch");
    expect(result).toContain("bg-success/20");
    expect(result).not.toContain("bg-base-300/30");
  });

  it("all returned strings contain the base transition class", () => {
    const cases: Array<[boolean, boolean, boolean, "edit" | "select" | "watch"]> = [
      [true, false, true, "edit"],
      [false, true, false, "select"],
      [false, false, true, "watch"],
      [false, false, false, "edit"],
    ];
    for (const args of cases) {
      expect(getScheduleCellClass(...args)).toContain(base);
    }
  });
});

import { describe, it, expect } from "vitest";
import { add, greet } from "../src/index.js";

describe("add", () => {
  it("adds two positive numbers", () => {
    expect(add(2, 3)).toBe(5);
  });
  it("adds negatives", () => {
    expect(add(-2, -3)).toBe(-5);
  });
  it("identity with 0", () => {
    expect(add(10, 0)).toBe(10);
  });
});

describe("greet", () => {
  it("greets by name (lowercase)", () => {
    expect(greet("kiro")).toBe("hello, kiro");
  });
});
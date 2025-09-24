import { describe, expect, it } from "vitest";
import { add } from "../src/index.js";

describe("index", () => {
  it("should add integers", () => {
    const sum = add(2)(3);
    expect(sum).toBe(5);
  });
});

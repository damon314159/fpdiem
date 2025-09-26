import { describe, it, expect } from "vitest";
import { Identity, identityFunctor } from "../src/identity.js";

// Helper functions for testing
const identity = <T>(x: T): T => x;
const double = (x: number): number => x * 2;
const toString = (x: number): string => x.toString();
const addOne = (x: number): number => x + 1;

describe("Identity", () => {
  describe("Construction", () => {
    it("should create Identity instance with Identity.of", () => {
      const result = Identity.of(42);
      expect(result.equals(Identity.of(42))).toBe(true);
    });
  });

  describe("Functor Laws", () => {
    it("should satisfy identity law", () => {
      const fa = Identity.of(42);
      const mapped = fa.map(identity);

      expect(mapped.equals(fa)).toBe(true);
    });

    it("should satisfy composition law", () => {
      const fa = Identity.of(5);

      // map(fa, compose(g, f)) === compose(map(g), map(f))(fa)
      const composed = fa.map((x: number) => toString(double(x)));
      const sequential = fa.map(double).map(toString);

      expect(composed.equals(sequential)).toBe(true);
    });
  });

  describe("Map behavior", () => {
    it("should transform values", () => {
      const fa = Identity.of(21);
      const result = fa.map(double);

      expect(result.equals(Identity.of(42))).toBe(true);
    });

    it("should chain transformations", () => {
      const fa = Identity.of(5);
      const result = fa.map(addOne).map(double);

      expect(result.equals(Identity.of(12))).toBe(true); // (5 + 1) * 2
    });
  });

  describe("Higher-kinded types integration", () => {
    it("should work with functor instance", () => {
      const value = Identity.of(5);
      const result = identityFunctor.map(value, double);
      expect(result.equals(Identity.of(10))).toBe(true);
    });
  });
});

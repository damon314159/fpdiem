import { describe, it, expect } from "vitest";
import { List, listFunctor } from "../src/list.js";

// Helper functions for testing
const identity = <T>(x: T): T => x;
const double = (x: number): number => x * 2;
const toString = (x: number): string => x.toString();
const addOne = (x: number): number => x + 1;

describe("List", () => {
  describe("Construction", () => {
    it("should create List instance with List.of", () => {
      const result = List.of(42);
      const expected = new List({ _type: "list", _A: [42] });
      expect(result.equals(expected)).toBe(true);
    });

    it("should create List instance with List.from", () => {
      const result = List.from([1, 2, 3]);
      const expected = new List({ _type: "list", _A: [1, 2, 3] });
      expect(result.equals(expected)).toBe(true);
    });

    it("should create empty List with List.empty", () => {
      const result = List.empty();
      const expected = new List({ _type: "list", _A: [] });
      expect(result.equals(expected)).toBe(true);
    });
  });

  describe("Functor Laws", () => {
    it("should satisfy identity law", () => {
      const fa = List.from([1, 2, 3]);
      const mapped = fa.map(identity);

      expect(mapped.equals(fa)).toBe(true);
    });

    it("should satisfy identity law for empty list", () => {
      const fa = List.empty();
      const mapped = fa.map(identity);

      expect(mapped.equals(fa)).toBe(true);
    });

    it("should satisfy composition law", () => {
      const fa = List.from([1, 2, 3]);

      // map(fa, compose(g, f)) === compose(map(g), map(f))(fa)
      const composed = fa.map((x: number) => toString(double(x)));
      const sequential = fa.map(double).map(toString);

      expect(composed.equals(sequential)).toBe(true);
    });
  });

  describe("Map behavior", () => {
    it("should transform values", () => {
      const fa = List.from([1, 2, 3]);
      const result = fa.map(double);
      const expected = List.from([2, 4, 6]);

      expect(result.equals(expected)).toBe(true);
    });

    it("should handle empty lists", () => {
      const fa = List.empty<number>();
      const result = fa.map(double);
      const expected = List.empty();

      expect(result.equals(expected)).toBe(true);
    });

    it("should chain transformations", () => {
      const fa = List.from([5, 10, 15]);
      const result = fa.map(addOne).map(double);
      const expected = List.from([12, 22, 32]); // (n + 1) * 2

      expect(result.equals(expected)).toBe(true);
    });
  });

  describe("Higher-kinded types integration", () => {
    it("should work with functor instance", () => {
      const list = List.from([1, 2, 3]);
      const result = listFunctor.map(list, double);
      const expected = List.from([2, 4, 6]);

      expect(result.equals(expected)).toBe(true);
    });
  });
});

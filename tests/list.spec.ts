import { describe, it, expect } from "vitest";
import { List, listFunctor, listApplicative, listMonad } from "../src/list.js";

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

  describe("Applicative behavior", () => {
    it("should apply function to values", () => {
      const functions = List.from([(x: number) => x * 2, (x: number) => x + 3]);
      const values = List.from([1, 2]);
      const result = functions.ap(values);

      // Expected: Each function applied to each value
      // [1*2, 2*2, 1+3, 2+3] = [2, 4, 4, 5]
      const expected = List.from([2, 4, 4, 5]);

      expect(result.equals(expected)).toBe(true);
    });

    it("should handle empty function list", () => {
      const functions = List.empty<(x: number) => number>();
      const values = List.from([1, 2, 3]);
      const result = functions.ap(values);
      const expected = List.empty();

      expect(result.equals(expected)).toBe(true);
    });

    it("should handle empty value list", () => {
      const functions = List.from([(x: number) => x * 2, (x: number) => x + 3]);
      const values = List.empty<number>();
      const result = functions.ap(values);
      const expected = List.empty();

      expect(result.equals(expected)).toBe(true);
    });

    it("should chain applications", () => {
      const add = (x: number) => (y: number) => x + y;
      const curriedAdd = List.of(add);
      const nums1 = List.from([1, 2]);
      const nums2 = List.from([10, 20]);

      const partiallyApplied = curriedAdd.ap(nums1); // [add(1), add(2)]
      const result = partiallyApplied.ap(nums2); // [add(1)(10), add(1)(20), add(2)(10), add(2)(20)]

      const expected = List.from([11, 21, 12, 22]); // [1+10, 1+20, 2+10, 2+20]
      expect(result.equals(expected)).toBe(true);
    });
  });

  describe("Monad behavior", () => {
    it("should flatMap values", () => {
      const fa = List.from([1, 2, 3]);
      const f = (x: number) => List.from([x, x * 2]);
      const result = fa.flatMap(f);

      // Expected: [1, 2, 2, 4, 3, 6]
      const expected = List.from([1, 2, 2, 4, 3, 6]);

      expect(result.equals(expected)).toBe(true);
    });

    it("should handle flatMap with empty result", () => {
      const fa = List.from([1, 2, 3]);
      const f = () => List.empty();
      const result = fa.flatMap(f);

      expect(result.equals(List.empty())).toBe(true);
    });

    it("should handle flatMap on empty list", () => {
      const fa = List.empty<number>();
      const f = (x: number) => List.from([x, x * 2]);
      const result = fa.flatMap(f);

      expect(result.equals(List.empty())).toBe(true);
    });

    it("should join nested Lists", () => {
      const nested = List.from([
        List.from([1, 2]),
        List.from([3, 4]),
        List.from([5, 6]),
      ]);
      const result = nested.join();

      const expected = List.from([1, 2, 3, 4, 5, 6]);
      expect(result.equals(expected)).toBe(true);
    });

    it("should join with empty nested lists", () => {
      const nested = List.from([
        List.from([1, 2]),
        List.empty(),
        List.from([5, 6]),
      ]);
      const result = nested.join();

      const expected = List.from([1, 2, 5, 6]);
      expect(result.equals(expected)).toBe(true);
    });

    it("should join empty outer list", () => {
      const nested = List.empty<List<number>>();
      const result = nested.join();

      expect(result.equals(List.empty())).toBe(true);
    });
  });

  describe("Higher-kinded types integration", () => {
    it("should work with functor instance", () => {
      const list = List.from([1, 2, 3]);
      const result = listFunctor.map(list, double);
      const expected = List.from([2, 4, 6]);

      expect(result.equals(expected)).toBe(true);
    });

    it("should work with applicative instance", () => {
      const functions = List.from([(x: number) => x * 2, (x: number) => x + 3]);
      const values = List.from([1, 2]);
      const result = listApplicative.ap(functions, values);

      const expected = List.from([2, 4, 4, 5]);
      expect(result.equals(expected)).toBe(true);
    });

    it("should work with monad instance", () => {
      const list = List.from([1, 2, 3]);
      const f = (x: number) => List.from([x, x * 2]);
      const result = listMonad.flatMap(list, f);

      const expected = List.from([1, 2, 2, 4, 3, 6]);
      expect(result.equals(expected)).toBe(true);
    });
  });
});

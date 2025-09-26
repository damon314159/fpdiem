import { describe, it, expect } from "vitest";
import { Maybe, None, Some, maybeFunctor } from "../src/maybe.js";

// Helper functions for testing
const identity = <T>(x: T): T => x;
const double = (x: number): number => x * 2;
const toString = (x: number): string => x.toString();
const addOne = (x: number): number => x + 1;

describe("Maybe", () => {
  describe("Construction", () => {
    it("should create Some instance with Maybe.of", () => {
      const result = Maybe.of(42);
      expect(result.equals(new Some(42))).toBe(true);
    });

    it("should create None instance", () => {
      const result = new None();
      expect(result.equals(new None())).toBe(true);
    });
  });

  describe("Functor Laws", () => {
    it("should satisfy identity law for Some", () => {
      const fa = Maybe.of(42);
      const mapped = fa.map(identity);

      expect(mapped.equals(fa)).toBe(true);
    });

    it("should satisfy identity law for None", () => {
      const fa = new None();
      const mapped = fa.map(identity);

      expect(mapped.equals(fa)).toBe(true);
    });

    it("should satisfy composition law for Some", () => {
      const fa = Maybe.of(5);

      // map(fa, compose(g, f)) === compose(map(g), map(f))(fa)
      const composed = fa.map((x: number) => toString(double(x)));
      const sequential = fa.map(double).map(toString);

      expect(composed.equals(sequential)).toBe(true);
    });

    it("should satisfy composition law for None", () => {
      const fa = new None();

      const composed = fa.map((x: number) => toString(double(x)));
      const sequential = fa.map(double).map(toString);

      expect(composed.equals(sequential)).toBe(true);
    });
  });

  describe("Map behavior", () => {
    it("should transform Some values", () => {
      const fa = Maybe.of(21);
      const result = fa.map(double);

      expect(result.equals(Maybe.of(42))).toBe(true);
    });

    it("should not transform None values", () => {
      const fa = new None();
      const result = fa.map(double);

      expect(result.equals(new None())).toBe(true);
    });

    it("should chain transformations on Some", () => {
      const fa = Maybe.of(5);
      const result = fa.map(addOne).map(double);

      expect(result.equals(Maybe.of(12))).toBe(true); // (5 + 1) * 2
    });

    it("should short-circuit on None", () => {
      const fa = new None();
      const result = fa.map(addOne).map(double);

      expect(result.equals(new None())).toBe(true);
    });
  });

  describe("Higher-kinded types integration", () => {
    it("should work with functor instance", () => {
      // Test with Some value
      const someValue = Maybe.of(5);
      const someResult = maybeFunctor.map(someValue, double);
      expect(someResult.equals(Maybe.of(10))).toBe(true);

      // Test with None value
      const noneValue = new None();
      const noneResult = maybeFunctor.map(noneValue, double);
      expect(noneResult.equals(new None())).toBe(true);
    });
  });
});

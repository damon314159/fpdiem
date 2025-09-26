import { describe, it, expect } from "vitest";
import {
  Identity,
  identityFunctor,
  identityApplicative,
  identityMonad,
} from "../../src/datatypes/identity.js";

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

  describe("Applicative behavior", () => {
    it("should apply function to value", () => {
      const fn = Identity.of((x: number) => x * 2);
      const val = Identity.of(5);
      const result = fn.ap(val);

      expect(result.equals(Identity.of(10))).toBe(true);
    });

    it("should chain applications", () => {
      const addThenMultiply = Identity.of(
        (x: number) => (y: number) => (x + y) * 2,
      );
      const five = Identity.of(5);
      const ten = Identity.of(10);

      const partiallyApplied = addThenMultiply.ap(five);
      const result = partiallyApplied.ap(ten);

      expect(result.equals(Identity.of(30))).toBe(true); // (5 + 10) * 2 = 30
    });
  });

  describe("Monad behavior", () => {
    it("should flatMap values", () => {
      const fa = Identity.of(5);
      const f = (x: number) => Identity.of(x * 2);
      const result = fa.flatMap(f);

      expect(result.equals(Identity.of(10))).toBe(true);
    });

    it("should chain flatMap operations", () => {
      const fa = Identity.of(5);
      const f = (x: number) => Identity.of(x + 3);
      const g = (x: number) => Identity.of(x * 2);
      const result = fa.flatMap(f).flatMap(g);

      expect(result.equals(Identity.of(16))).toBe(true); // (5 + 3) * 2 = 16
    });

    it("should satisfy left identity law", () => {
      // return a >>= f ≡ f a
      const a = 5;
      const f = (x: number) => Identity.of(x * 2);

      const left = Identity.of(a).flatMap(f);
      const right = f(a);

      expect(left.equals(right)).toBe(true);
    });

    it("should satisfy right identity law", () => {
      // m >>= return ≡ m
      const m = Identity.of(5);
      const result = m.flatMap(Identity.of.bind(Identity));

      expect(result.equals(m)).toBe(true);
    });

    it("should satisfy associativity law", () => {
      // (m >>= f) >>= g ≡ m >>= (\x -> f x >>= g)
      const m = Identity.of(5);
      const f = (x: number) => Identity.of(x + 3);
      const g = (x: number) => Identity.of(x * 2);

      const left = m.flatMap(f).flatMap(g);
      const right = m.flatMap((x) => f(x).flatMap(g));

      expect(left.equals(right)).toBe(true);
    });

    it("should join nested Identity values", () => {
      const nested = Identity.of(Identity.of(5));
      const result = nested.join();

      expect(result.equals(Identity.of(5))).toBe(true);
    });
  });

  describe("Higher-kinded types integration", () => {
    it("should work with functor instance", () => {
      const value = Identity.of(5);
      const result = identityFunctor.map(value, double);
      expect(result.equals(Identity.of(10))).toBe(true);
    });

    it("should work with applicative instance", () => {
      const value = Identity.of(5);
      const fn = Identity.of((x: number) => x * 2);
      const result = identityApplicative.ap(fn, value);
      expect(result.equals(Identity.of(10))).toBe(true);
    });

    it("should work with monad instance", () => {
      const value = Identity.of(5);
      const f = (x: number) => Identity.of(x * 2);
      const result = identityMonad.flatMap(value, f);
      expect(result.equals(Identity.of(10))).toBe(true);
    });
  });
});

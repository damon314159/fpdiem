import { describe, it, expect } from "vitest";
import { Either, Left, Right, eitherFunctor } from "../src/either.js";

const identity = <T>(x: T): T => x;
const double = (x: number): number => x * 2;
const toString = (x: number): string => x.toString();
const addOne = (x: number): number => x + 1;

describe("Either", () => {
  describe("Construction", () => {
    it("should create Right instance with Either.of", () => {
      const result = Either.of(42);
      expect(result.equals(new Right(42))).toBe(true);
    });

    it("should create Left instance", () => {
      const result = new Left("error");
      expect(result.equals(new Left("error"))).toBe(true);
    });
  });

  describe("Functor Laws", () => {
    it("should satisfy identity law for Right", () => {
      const fa = Either.of(42);
      const mapped = fa.map(identity);

      expect(mapped.equals(fa)).toBe(true);
    });

    it("should satisfy identity law for Left", () => {
      const fa = new Left("error");
      const mapped = fa.map(identity);

      expect(mapped.equals(fa)).toBe(true);
    });

    it("should satisfy composition law for Right", () => {
      const fa = Either.of(5);

      // map(fa, compose(g, f)) === compose(map(g), map(f))(fa)
      const composed = fa.map((x: number) => toString(double(x)));
      const sequential = fa.map(double).map(toString);

      expect(composed.equals(sequential)).toBe(true);
    });

    it("should satisfy composition law for Left", () => {
      const fa = new Left("error");

      const composed = fa.map((x: number) => toString(double(x)));
      const sequential = fa.map(double).map(toString);

      expect(composed.equals(sequential)).toBe(true);
      expect(composed.equals(new Left("error"))).toBe(true);
    });
  });

  describe("Map behavior", () => {
    it("should transform Right values", () => {
      const fa = Either.of(21);
      const result = fa.map(double);

      expect(result.equals(Either.of(42))).toBe(true);
    });

    it("should not transform Left values", () => {
      const fa = new Left("error");
      const result = fa.map(double);

      expect(result.equals(new Left("error"))).toBe(true);
    });

    it("should chain transformations on Right", () => {
      const fa = Either.of(5);
      const result = fa.map(addOne).map(double);

      expect(result.equals(Either.of(12))).toBe(true); // (5 + 1) * 2
    });

    it("should short-circuit on Left", () => {
      const fa = new Left("initial error");
      const result = fa.map(addOne).map(double);

      expect(result.equals(new Left("initial error"))).toBe(true);
    });
  });

  describe("Higher-kinded types integration", () => {
    it("should work with functor instance", () => {
      const rightValue = Either.of(5);
      const rightResult = eitherFunctor.map(rightValue, double);
      expect(rightResult.equals(Either.of(10))).toBe(true);

      const leftValue = new Left("error");
      const leftResult = eitherFunctor.map(leftValue, double);
      expect(leftResult.equals(new Left("error"))).toBe(true);
    });
  });

  describe("Type safety", () => {
    it("should handle type transformations correctly", () => {
      const fa = Either.of(42);
      const result = fa.map(toString);

      const lengthResult = result.map((s) => s.length);
      expect(lengthResult.equals(Either.of(2))).toBe(true);
    });

    it("should preserve Left type during transformations", () => {
      const fa = new Left(new Error("test"));
      const result = fa.map(toString);

      expect(result.equals(fa)).toBe(true);
    });
  });
});

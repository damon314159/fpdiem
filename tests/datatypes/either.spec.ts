import { describe, it, expect } from "vitest";
import {
  Either,
  Left,
  Right,
  eitherFunctor,
  eitherApplicative,
  eitherMonad,
} from "../../src/datatypes/either.js";

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

  describe("Applicative behavior", () => {
    it("should apply function in Right to Right value", () => {
      const fn = Either.of((x: number) => x * 2);
      const value = Either.of(5);
      const result = fn.ap(value);

      expect(result.equals(Either.of(10))).toBe(true);
    });

    it("should not apply function in Right to Left value", () => {
      const fn = Either.of((x: number) => x * 2);
      const value = new Left("error");
      const result = fn.ap(value);

      expect(result.equals(new Left("error"))).toBe(true);
    });

    it("should not apply function in Left to Right value", () => {
      const fn = new Left("fn error");
      const value = Either.of(5);
      const result = fn.ap(value);

      expect(result.equals(new Left("fn error"))).toBe(true);
    });

    it("should not apply function in Left to Left value", () => {
      const fn = new Left("fn error");
      const value = new Left("value error");
      const result = fn.ap(value);

      expect(result.equals(new Left("fn error"))).toBe(true);
    });
  });

  describe("Monad behavior", () => {
    it("should flatMap Right value", () => {
      const fa = Either.of(5);
      const f = (x: number) => Either.of(x * 2);
      const result = fa.flatMap(f);

      expect(result.equals(Either.of(10))).toBe(true);
    });

    it("should not flatMap Left value", () => {
      const fa = new Left("error");
      const f = (x: number) => Either.of(x * 2);
      const result = fa.flatMap(f);

      expect(result.equals(new Left("error"))).toBe(true);
    });

    it("should handle flatMap returning Left", () => {
      const fa: Either<string, number> = Either.of(5);
      const f = () => new Left("flatMap error");
      const result = fa.flatMap(f);

      expect(result.equals(new Left("flatMap error"))).toBe(true);
    });

    it("should join nested Right values", () => {
      const nested = Either.of(Either.of(5));
      const result = nested.join();

      expect(result.equals(Either.of(5))).toBe(true);
    });

    it("should join nested Right with Left value", () => {
      const nested = Either.of(new Left("inner error"));
      const result = nested.join();

      expect(result.equals(new Left("inner error"))).toBe(true);
    });

    it("should not join outer Left", () => {
      const nested = new Left("outer error");
      const result = nested.join();

      expect(result.equals(new Left("outer error"))).toBe(true);
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

    it("should work with applicative instance", () => {
      // Test with Right values
      const rightValue = Either.of(5);
      const rightFunction = Either.of((x: number) => x * 2);
      const rightResult = eitherApplicative.ap(rightFunction, rightValue);
      expect(rightResult.equals(Either.of(10))).toBe(true);

      // Test with Left value
      const leftValue = new Left("value error");
      const leftResult = eitherApplicative.ap(rightFunction, leftValue);
      expect(leftResult.equals(new Left("value error"))).toBe(true);

      // Test with Left function
      const leftFunction = new Left("function error");
      const anotherResult = eitherApplicative.ap(leftFunction, rightValue);
      expect(anotherResult.equals(new Left("function error"))).toBe(true);
    });

    it("should work with monad instance", () => {
      // Test with Right value
      const rightValue = Either.of(5);
      const f = (x: number) => Either.of(x * 2);
      const rightResult = eitherMonad.flatMap(rightValue, f);
      expect(rightResult.equals(Either.of(10))).toBe(true);

      // Test with Left value
      const leftValue = new Left("error");
      const leftResult = eitherMonad.flatMap(leftValue, f);
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

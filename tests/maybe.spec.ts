import { describe, it, expect } from "vitest";
import {
  Maybe,
  None,
  Some,
  maybeFunctor,
  maybeApplicative,
  maybeMonad,
} from "../src/maybe.js";

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

  describe("Applicative behavior", () => {
    it("should apply function in Some to Some value", () => {
      const fn = Maybe.of((x: number) => x * 2);
      const value = Maybe.of(5);
      const result = fn.ap(value);

      expect(result.equals(Maybe.of(10))).toBe(true);
    });

    it("should not apply function in Some to None value", () => {
      const fn = Maybe.of((x: number) => x * 2);
      const value = new None();
      const result = fn.ap(value);

      expect(result.equals(new None())).toBe(true);
    });

    it("should not apply function in None to Some value", () => {
      const fn = new None();
      const value = Maybe.of(5);
      const result = fn.ap(value);

      expect(result.equals(new None())).toBe(true);
    });

    it("should not apply function in None to None value", () => {
      const fn = new None();
      const value = new None();
      const result = fn.ap(value);

      expect(result.equals(new None())).toBe(true);
    });
  });

  describe("Monad behavior", () => {
    it("should flatMap Some value", () => {
      const fa = Maybe.of(5);
      const f = (x: number) => Maybe.of(x * 2);
      const result = fa.flatMap(f);

      expect(result.equals(Maybe.of(10))).toBe(true);
    });

    it("should not flatMap None value", () => {
      const fa = new None();
      const f = (x: number) => Maybe.of(x * 2);
      const result = fa.flatMap(f);

      expect(result.equals(new None())).toBe(true);
    });

    it("should handle flatMap returning None", () => {
      const fa = Maybe.of(5);
      const f = () => new None();
      const result = fa.flatMap(f);

      expect(result.equals(new None())).toBe(true);
    });

    it("should join nested Some values", () => {
      const nested = Maybe.of(Maybe.of(5));
      const result = nested.join();

      expect(result.equals(Maybe.of(5))).toBe(true);
    });

    it("should join nested None values", () => {
      const nested = Maybe.of(new None());
      const result = nested.join();

      expect(result.equals(new None())).toBe(true);
    });

    it("should not join outer None", () => {
      const nested = new None();
      const result = nested.join();

      expect(result.equals(new None())).toBe(true);
    });
  });

  describe("Higher-kinded types integration", () => {
    it("should work with functor instance", () => {
      const someValue = Maybe.of(5);
      const someResult = maybeFunctor.map(someValue, double);
      expect(someResult.equals(Maybe.of(10))).toBe(true);

      const noneValue = new None();
      const noneResult = maybeFunctor.map(noneValue, double);
      expect(noneResult.equals(new None())).toBe(true);
    });

    it("should work with applicative instance", () => {
      const someValue = Maybe.of(5);
      const someFunction = Maybe.of((x: number) => x * 2);
      const someResult = maybeApplicative.ap(someFunction, someValue);
      expect(someResult.equals(Maybe.of(10))).toBe(true);

      const noneValue = new None();
      const noneResult = maybeApplicative.ap(someFunction, noneValue);
      expect(noneResult.equals(new None())).toBe(true);

      const noneFunction = new None();
      const anotherResult = maybeApplicative.ap(noneFunction, someValue);
      expect(anotherResult.equals(new None())).toBe(true);
    });

    it("should work with monad instance", () => {
      const someValue = Maybe.of(5);
      const f = (x: number) => Maybe.of(x * 2);
      const someResult = maybeMonad.flatMap(someValue, f);
      expect(someResult.equals(Maybe.of(10))).toBe(true);

      const noneValue = new None();
      const noneResult = maybeMonad.flatMap(noneValue, f);
      expect(noneResult.equals(new None())).toBe(true);
    });
  });
});

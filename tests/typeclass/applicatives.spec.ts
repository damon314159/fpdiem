import { describe, it, expect } from "vitest";
import { Either, Left } from "../../src/datatypes/either.js";
import { Identity } from "../../src/datatypes/identity.js";
import { List } from "../../src/datatypes/list.js";
import { Maybe, None } from "../../src/datatypes/maybe.js";
import { ap } from "../../src/typeclass/applicatives.js";

describe("Applicatives module", () => {
  describe("with Identity", () => {
    it("should apply function to value", () => {
      const fn = Identity.of((x: number) => x * 2);
      const value = Identity.of(5);
      const result = ap(fn)(value);

      expect(result.equals(Identity.of(10))).toBe(true);
    });

    it("should work with type transformations", () => {
      const fn = Identity.of((x: number) => x.toString());
      const value = Identity.of(42);
      const result = ap(fn)(value);

      expect(result.equals(Identity.of("42"))).toBe(true);
    });

    it("should satisfy applicative identity law", () => {
      // A.of(x => x) ap v === v
      const idFn = Identity.of((x: number) => x);
      const value = Identity.of(10);
      const result = ap(idFn)(value);

      expect(result.equals(value)).toBe(true);
    });

    it("should satisfy applicative homomorphism law", () => {
      // A.of(f) ap A.of(x) === A.of(f(x))
      const f = (x: number) => x * 2;
      const x = 5;

      const left = ap(Identity.of(f))(Identity.of(x));
      const right = Identity.of(f(x));

      expect(left.equals(right)).toBe(true);
    });

    it("should satisfy applicative composition law", () => {
      const compose =
        (f: (x: number) => string) =>
        (g: (x: number) => number) =>
        (x: number) =>
          f(g(x));
      const u = Identity.of((x: number) => x.toString());
      const v = Identity.of((x: number) => x * 2);
      const w = Identity.of(5);

      const left = ap(ap(ap(Identity.of(compose))(u))(v))(w);
      const right = ap(u)(ap(v)(w));

      expect(left.equals(right)).toBe(true);
    });
  });

  describe("with List", () => {
    it("should apply functions to values", () => {
      const fns = List.from([(x: number) => x * 2, (x: number) => x + 3]);
      const values = List.from([1, 2]);
      const result = ap(fns)(values);

      expect(result.equals(List.from([2, 4, 4, 5]))).toBe(true);
    });

    it("should handle empty function list", () => {
      const fns = List.empty();
      const values = List.from([1, 2, 3]);
      const result = ap(fns)(values);

      expect(result.equals(List.empty())).toBe(true);
    });

    it("should handle empty value list", () => {
      const fns = List.from([(x: number) => x * 2]);
      const values = List.empty();
      const result = ap(fns)(values);

      expect(result.equals(List.empty())).toBe(true);
    });
  });

  describe("with Maybe", () => {
    it("should apply function in Some to Some value", () => {
      const fn = Maybe.of((x: number) => x * 2);
      const value = Maybe.of(5);
      const result = ap(fn)(value);

      expect(result.equals(Maybe.of(10))).toBe(true);
    });

    it("should return None when applying function in Some to None", () => {
      const fn = Maybe.of((x: number) => x * 2);
      const value = new None();
      const result = ap(fn)(value);

      expect(result.equals(new None())).toBe(true);
    });

    it("should return None when applying function in None to Some", () => {
      const fn = new None();
      const value = Maybe.of(5);
      const result = ap(fn)(value);

      expect(result.equals(new None())).toBe(true);
    });

    it("should return None when applying function in None to None", () => {
      const fn = new None();
      const value = new None();
      const result = ap(fn)(value);

      expect(result.equals(new None())).toBe(true);
    });
  });

  describe("with Either", () => {
    it("should apply function in Right to Right value", () => {
      const fn = Either.of((x: number) => x * 2);
      const value = Either.of(5);
      const result = ap(fn)(value);

      expect(result.equals(Either.of(10))).toBe(true);
    });

    it("should return Left when applying function in Right to Left", () => {
      const fn = Either.of((x: number) => x * 2);
      const value = new Left("error");
      const result = ap(fn)(value);

      expect(result.equals(new Left("error"))).toBe(true);
    });

    it("should return Left when applying function in Left to Right", () => {
      const fn = new Left("fn error");
      const value = Either.of(5);
      const result = ap(fn)(value);

      expect(result.equals(new Left("fn error"))).toBe(true);
    });

    it("should prioritize first Left when applying function in Left to Left", () => {
      const fn = new Left("fn error");
      const value = new Left("value error");
      const result = ap(fn)(value);

      expect(result.equals(new Left("fn error"))).toBe(true);
    });
  });
});

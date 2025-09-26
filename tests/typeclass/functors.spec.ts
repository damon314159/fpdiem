import { describe, it, expect } from "vitest";
import { Either, Left } from "../../src/datatypes/either.js";
import { Identity } from "../../src/datatypes/identity.js";
import { List } from "../../src/datatypes/list.js";
import { Maybe, None } from "../../src/datatypes/maybe.js";
import { map } from "../../src/typeclass/functors.js";

describe("Functors module", () => {
  describe("with Identity", () => {
    it("should map over Identity values", () => {
      const identity = Identity.of(5);
      const double = (x: number) => x * 2;
      const doubler = map(double);
      const result = doubler(identity);

      expect(result.equals(Identity.of(10))).toBe(true);
    });

    it("should satisfy functor laws", () => {
      const identity = Identity.of(5);
      const id = <T>(x: T): T => x;
      const double = (x: number) => x * 2;
      const inc = (x: number) => x + 1;

      // Identity law
      const idMapped = map(id)(identity);
      expect(idMapped.equals(identity)).toBe(true);

      // Composition law
      const composed = map((x: number) => double(inc(x)))(identity);
      const chained = map(double)(map(inc)(identity));
      expect(composed.equals(chained)).toBe(true);
    });
  });

  describe("with List", () => {
    it("should map over List values", () => {
      const list = List.from([1, 2, 3]);
      const doubleString = (x: number) => `${x * 2}`;
      const result = map(doubleString)(list);

      expect(result.equals(List.from(["2", "4", "6"]))).toBe(true);
    });

    it("should handle empty lists", () => {
      const list = List.empty();
      const double = (x: number) => x * 2;
      const result = map(double)(list);

      expect(result.equals(List.empty())).toBe(true);
    });
  });

  describe("with Maybe", () => {
    it("should map over Some values", () => {
      const maybe = Maybe.of(5);
      const double = (x: number) => x * 2;
      const result = map(double)(maybe);

      expect(result.equals(Maybe.of(10))).toBe(true);
    });

    it("should skip mapping over None values", () => {
      const maybe = new None();
      const double = (x: number) => x * 2;
      const result = map(double)(maybe);

      expect(result.equals(new None())).toBe(true);
    });
  });

  describe("with Either", () => {
    it("should map over Right values", () => {
      const either = Either.of(5);
      const double = (x: number) => x * 2;
      const result = map(double)(either);

      expect(result.equals(Either.of(10))).toBe(true);
    });

    it("should skip mapping over Left values", () => {
      const either = new Left("error");
      const double = (x: number) => x * 2;
      const result = map(double)(either);

      expect(result.equals(new Left("error"))).toBe(true);
    });
  });

  describe("generic usage", () => {
    it("should work with multiple functors", () => {
      const doubleMapper = map((x: number) => x * 2);

      const identity = Identity.of(5);
      const list = List.from([1, 2, 3]);
      const maybe = Maybe.of(10);
      const either = Either.of(20);

      const identityResult = doubleMapper(identity);
      const listResult = doubleMapper(list);
      const maybeResult = doubleMapper(maybe);
      const eitherResult = doubleMapper(either);

      expect(identityResult.equals(Identity.of(10))).toBe(true);
      expect(listResult.equals(List.from([2, 4, 6]))).toBe(true);
      expect(maybeResult.equals(Maybe.of(20))).toBe(true);
      expect(eitherResult.equals(Either.of(40))).toBe(true);
    });

    it("should handle type transformations", () => {
      const toStringMapper = map((x: number) => x.toString());

      const identity = Identity.of(42);
      const list = List.from([1, 2, 3]);
      const maybe = Maybe.of(10);
      const either = Either.of(20);

      const identityResult = toStringMapper(identity);
      const listResult = toStringMapper(list);
      const maybeResult = toStringMapper(maybe);
      const eitherResult = toStringMapper(either);

      expect(identityResult.equals(Identity.of("42"))).toBe(true);
      expect(listResult.equals(List.from(["1", "2", "3"]))).toBe(true);
      expect(maybeResult.equals(Maybe.of("10"))).toBe(true);
      expect(eitherResult.equals(Either.of("20"))).toBe(true);
    });
  });
});

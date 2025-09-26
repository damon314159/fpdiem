import { describe, it, expect } from "vitest";
import {
  Either,
  eitherMonad,
  EitherURI,
  Left,
} from "../../src/datatypes/either.js";
import { Identity, IdentityURI } from "../../src/datatypes/identity.js";
import { List, ListURI } from "../../src/datatypes/list.js";
import { Maybe, MaybeURI, None } from "../../src/datatypes/maybe.js";
import { flatMap, monadInstances } from "../../src/typeclass/monads.js";

describe("Monads module", () => {
  describe("flatMap function", () => {
    describe("with Identity", () => {
      it("should flatMap values", () => {
        const value = Identity.of(5);
        const f = (x: number) => Identity.of(x * 2);
        const result = flatMap<IdentityURI, number, number>(f)(value);

        expect(result.equals(Identity.of(10))).toBe(true);
      });

      it("should work with type transformations", () => {
        const value = Identity.of(5);
        const f = (x: number) => Identity.of(x.toString());
        const result = flatMap<IdentityURI, number, string>(f)(value);

        expect(result.equals(Identity.of("5"))).toBe(true);
      });

      it("should satisfy left identity law", () => {
        // return a >>= f ≡ f a
        const a = 5;
        const f = (x: number) => Identity.of(x * 2);

        const left = flatMap<IdentityURI, number, number>(f)(Identity.of(a));
        const right = f(a);

        expect(left.equals(right)).toBe(true);
      });

      it("should satisfy right identity law", () => {
        // m >>= return ≡ m
        const m = Identity.of(5);
        const result = flatMap<IdentityURI, number, number>((x: number) =>
          Identity.of(x),
        )(m);

        expect(result.equals(m)).toBe(true);
      });

      it("should satisfy associativity law", () => {
        // (m >>= f) >>= g ≡ m >>= (\x -> f x >>= g)
        const m = Identity.of(5);
        const f = (x: number) => Identity.of(x + 3);
        const g = (x: number) => Identity.of(x * 2);

        const left = flatMap<IdentityURI, number, number>(g)(
          flatMap<IdentityURI, number, number>(f)(m),
        );
        const right = flatMap<IdentityURI, number, number>((x: number) =>
          flatMap<IdentityURI, number, number>(g)(f(x)),
        )(m);

        expect(left.equals(right)).toBe(true);
      });
    });

    describe("with List", () => {
      it("should flatMap values", () => {
        const list = List.from([1, 2, 3]);
        const f = (x: number) => List.from([x, x * 2]);
        const result = flatMap<ListURI, number, number>(f)(list);

        expect(result.equals(List.from([1, 2, 2, 4, 3, 6]))).toBe(true);
      });

      it("should handle empty lists", () => {
        const list = List.empty();
        const f = (x: number) => List.from([x, x * 2]);
        const result = flatMap<ListURI, number, number>(f)(list);

        expect(result.equals(List.empty())).toBe(true);
      });

      it("should handle functions returning empty lists", () => {
        const list = List.from([1, 2, 3]);
        const f = () => List.empty<number>();
        const result = flatMap<ListURI, number, number>(f)(list);

        expect(result.equals(List.empty())).toBe(true);
      });

      it("should satisfy left identity law", () => {
        // return a >>= f ≡ f a
        const a = 5;
        const f = (x: number) => List.from([x, x * 2]);

        const left = flatMap<ListURI, number, number>(f)(List.of(a));
        const right = f(a);

        expect(left.equals(right)).toBe(true);
      });

      it("should satisfy right identity law", () => {
        // m >>= return ≡ m
        const m = List.from([1, 2, 3]);
        const result = flatMap<ListURI, number, number>(List.of.bind(List))(m);

        expect(result.equals(m)).toBe(true);
      });
    });

    describe("with Maybe", () => {
      it("should flatMap Some values", () => {
        const maybe = Maybe.of(5);
        const f = (x: number) => Maybe.of(x * 2);
        const result = flatMap<MaybeURI, number, number>(f)(maybe);

        expect(result.equals(Maybe.of(10))).toBe(true);
      });

      it("should not flatMap None values", () => {
        const maybe = new None();
        const f = (x: number) => Maybe.of(x * 2);
        const result = flatMap<MaybeURI, number, number>(f)(maybe);

        expect(result.equals(new None())).toBe(true);
      });

      it("should handle functions returning None", () => {
        const maybe = Maybe.of(5);
        const f = () => new None();
        const result = flatMap<MaybeURI, number, number>(f)(maybe);

        expect(result.equals(new None())).toBe(true);
      });

      it("should satisfy left identity law", () => {
        // return a >>= f ≡ f a
        const a = 5;
        const f = (x: number) => Maybe.of(x * 2);

        const left = flatMap<MaybeURI, number, number>(f)(Maybe.of(a));
        const right = f(a);

        expect(left.equals(right)).toBe(true);
      });

      it("should satisfy right identity law", () => {
        // m >>= return ≡ m
        const m = Maybe.of(5);
        const result = flatMap<MaybeURI, number, number>(Maybe.of.bind(Maybe))(
          m,
        );

        expect(result.equals(m)).toBe(true);
      });
    });

    describe("with Either", () => {
      it("should flatMap Right values", () => {
        const either = Either.of(5);
        const f = (x: number) => Either.of(x * 2);
        const result = flatMap<EitherURI, Error, number, number>(f)(either);

        expect(result.equals(Either.of(10))).toBe(true);
      });

      it("should not flatMap Left values", () => {
        const either = new Left("error");
        const f = (x: number) => Either.of(x * 2);
        const result = flatMap<EitherURI, Error, number, number>(f)(either);

        expect(result.equals(new Left("error"))).toBe(true);
      });

      it("should handle functions returning Left", () => {
        const either = Either.of(5);
        const error = new Error("function error");
        const f = () => new Left(error);
        const result = flatMap<EitherURI, Error, number, number>(f)(either);

        expect(result.equals(new Left(error))).toBe(true);
      });

      it("should satisfy left identity law", () => {
        // return a >>= f ≡ f a
        const a = 5;
        const f = (x: number) => Either.of(x * 2);

        const left = flatMap<EitherURI, Error, number, number>(f)(Either.of(a));
        const right = f(a);

        expect(left.equals(right)).toBe(true);
      });

      it("should satisfy right identity law", () => {
        // m >>= return ≡ m
        const m = Either.of(5);
        const result = flatMap<EitherURI, Error, number, number>(
          Either.of.bind(Either),
        )(m);

        expect(result.equals(m)).toBe(true);
      });
    });
  });

  describe("monadInstances", () => {
    it("should contain all expected monad instances", () => {
      expect(monadInstances.Identity).toBeDefined();
      expect(monadInstances.List).toBeDefined();
      expect(monadInstances.Maybe).toBeDefined();
      expect(monadInstances.Either).toBeDefined();
    });

    it("should have consistent behavior with direct implementation", () => {
      const value = Either.of(5);
      const f = (x: number) => Either.of(x * 2);

      const result1 = flatMap<EitherURI, Error, number, number>(f)(value);
      const result2 = eitherMonad.flatMap(value, f);

      expect(result1.equals(result2)).toBe(true);
    });
  });

  describe("Chain operations across different monads", () => {
    it("should allow chaining multiple flatMap operations", () => {
      const value = Identity.of(5);
      const f = (x: number) => Identity.of(x + 3);
      const g = (x: number) => Identity.of(x * 2);

      const result = flatMap<IdentityURI, number, number>(g)(
        flatMap<IdentityURI, number, number>(f)(value),
      );
      expect(result.equals(Identity.of(16))).toBe(true); // (5 + 3) * 2
    });

    it("should handle chained operations that change types", () => {
      const value = Maybe.of(5);
      const f = (x: number) => Maybe.of(x.toString());
      const g = (s: string) => Maybe.of(s.length);

      const result = flatMap<MaybeURI, string, number>(g)(
        flatMap<MaybeURI, number, string>(f)(value),
      );
      expect(result.equals(Maybe.of(1))).toBe(true); // length of "5" is 1
    });
  });
});

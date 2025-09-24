import { describe, it, expect } from "vitest";
import { Either } from "../src/either.js";
import { Functor2 } from "../src/functor.js";
import { URIS2, URItoKind2 } from "../src/hkt.js";

// Helper functions for testing
const identity = <T>(x: T): T => x;
const double = (x: number): number => x * 2;
const toString = (x: number): string => x.toString();
const addOne = (x: number): number => x + 1;

describe("Either", () => {
  describe("Construction", () => {
    it("should create Right instance with Either.of", () => {
      const result = Either.of(42);
      expect(result.value._type).toBe("right");
      expect(result.value.right).toBe(42);
    });

    it("should create Left instance", () => {
      const result = new Either({ _type: "left", left: "error" });
      expect(result.value._type).toBe("left");
      expect(result.value.left).toBe("error");
    });

    it("should have correct URI", () => {
      const result = Either.of(42);
      expect(result.URI).toBe("Either");
    });
  });

  describe("Functor Laws", () => {
    it("should satisfy identity law for Right", () => {
      const fa = Either.of(42);
      const mapped = Either.map(fa, identity);

      expect(mapped.value).toEqual(fa.value);
    });

    it("should satisfy identity law for Left", () => {
      const fa = new Either({ _type: "left", left: "error" });
      const mapped = Either.map(fa, identity);

      expect(mapped.value).toEqual(fa.value);
    });

    it("should satisfy composition law for Right", () => {
      const fa = Either.of(5);

      // map(fa, compose(g, f)) === compose(map(g), map(f))(fa)
      const composed = Either.map(fa, (x: number) => toString(double(x)));
      const sequential = Either.map(Either.map(fa, double), toString);

      expect(composed.value).toEqual(sequential.value);
    });

    it("should satisfy composition law for Left", () => {
      const fa = new Either<string, number>({ _type: "left", left: "error" });

      const composed = Either.map(fa, (x: number) => toString(double(x)));
      const sequential = Either.map(Either.map(fa, double), toString);

      expect(composed.value).toEqual(sequential.value);
      expect(composed.value._type).toBe("left");
    });
  });

  describe("Map behavior", () => {
    it("should transform Right values", () => {
      const fa = Either.of(21);
      const result = Either.map(fa, double);

      expect(result.value._type).toBe("right");
      expect(result.value.right).toBe(42);
    });

    it("should not transform Left values", () => {
      const fa = new Either<string, number>({ _type: "left", left: "error" });
      const result = Either.map(fa, double);

      expect(result.value._type).toBe("left");
      expect(result.value.left).toBe("error");
    });

    it("should chain transformations on Right", () => {
      const fa = Either.of(5);
      const result = Either.map(Either.map(fa, addOne), double);

      expect(result.value._type).toBe("right");
      expect(result.value.right).toBe(12); // (5 + 1) * 2
    });

    it("should short-circuit on Left", () => {
      const fa = new Either<string, number>({
        _type: "left",
        left: "initial error",
      });
      const result = Either.map(Either.map(fa, addOne), double);

      expect(result.value._type).toBe("left");
      expect(result.value.left).toBe("initial error");
    });
  });

  describe("Instance methods", () => {
    it("should work with instance map method", () => {
      const fa = Either.of(10);
      const result = fa.map(fa, double);

      expect(result.value._type).toBe("right");
      expect(result.value.right).toBe(20);
    });

    it("should work with instance of method", () => {
      const fa = Either.of(10);
      const result = fa.of(42);

      expect(result.value._type).toBe("right");
      expect(result.value.right).toBe(42);
    });
  });

  describe("Type safety", () => {
    it("should handle type transformations correctly", () => {
      const fa = Either.of(42);
      const result = Either.map(fa, toString);

      expect(result.value._type).toBe("right");
      expect(result.value.right).toBe("42");
      expect(typeof result.value.right).toBe("string");
    });

    it("should preserve Left type during transformations", () => {
      const fa = new Either<Error, number>({
        _type: "left",
        left: new Error("test"),
      });
      const result = Either.map(fa, toString);

      expect(result.value._type).toBe("left");
      expect(result.value.left).toBeInstanceOf(Error);
      expect(result.value.left.message).toBe("test");
    });
  });

  describe("Higher-kinded types integration", () => {
    it("should work with map2 function", () => {
      const functorInstances: {
        [K in URIS2]: Functor2<K>;
      } = {
        Either: {
          URI: "Either",
          map: (fa, f) => Either.map(fa, f),
        },
      };

      function map2<E, A, B>(f: (a: A) => B) {
        return <F extends URIS2>(
          fa: URItoKind2<E, A>[F],
        ): URItoKind2<E, B>[F] => {
          const instance = functorInstances[fa.URI];
          return instance.map(fa, f);
        };
      }
      const mapper = map2((x: number) => `${2 * x}`);
      const result = mapper(Either.of(5));

      expect(result.value._type).toBe("right");
      expect(result.value.right).toBe("10");
    });
  });

  describe("Edge cases", () => {
    it("should handle null and undefined in Right", () => {
      const nullRight = Either.of(null);
      const undefinedRight = Either.of(undefined);

      expect(nullRight.value._type).toBe("right");
      expect(nullRight.value.right).toBe(null);

      expect(undefinedRight.value._type).toBe("right");
      expect(undefinedRight.value.right).toBe(undefined);
    });

    it("should handle null and undefined in Left", () => {
      const nullLeft = new Either({ _type: "left", left: null });
      const undefinedLeft = new Either({ _type: "left", left: undefined });

      expect(nullLeft.value._type).toBe("left");
      expect(nullLeft.value.left).toBe(null);

      expect(undefinedLeft.value._type).toBe("left");
      expect(undefinedLeft.value.left).toBe(undefined);
    });

    it("should handle functions as values", () => {
      const fn = (x: number) => x * 2;
      const result = Either.of(fn);

      expect(result.value._type).toBe("right");
      expect(typeof result.value.right).toBe("function");
      expect(result.value.right(5)).toBe(10);
    });

    it("should handle objects as values", () => {
      const obj = { a: 1, b: "test" };
      const result = Either.of(obj);

      expect(result.value._type).toBe("right");
      expect(result.value.right).toEqual(obj);
    });
  });

  describe("Error handling", () => {
    it("should not throw when mapping over Left", () => {
      const fa = new Either<string, number>({ _type: "left", left: "error" });

      expect(() => {
        Either.map(fa, (x: number) => {
          throw new Error("This should not be called");
        });
      }).not.toThrow();
    });

    it("should propagate errors in Right mapping", () => {
      const fa = Either.of(42);

      expect(() => {
        Either.map(fa, (x: number) => {
          throw new Error("Mapping error");
        });
      }).toThrow("Mapping error");
    });
  });
});

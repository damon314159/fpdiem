import { Either, Left, Right } from "./datatypes/either.js";
import { List } from "./datatypes/list.js";
import { Maybe, None } from "./datatypes/maybe.js";

// ---------------------------------------------------------------------------
// Basic utility functions
// ---------------------------------------------------------------------------

/**
 * Identity function - returns the input value unchanged
 */
export const identity = <A>(a: A) => a;

/**
 * Constant function - returns the first argument and ignores the second
 */
export const constant =
  <A>(a: A) =>
  () =>
    a;

/**
 * Compose multiple functions from left to right
 */
export function pipe(): <A>(a: A) => A;
export function pipe<A, B>(ab: (a: A) => B): (a: A) => B;
export function pipe<A, B, C>(ab: (a: A) => B, bc: (b: B) => C): (a: A) => C;
export function pipe<A, B, C, D>(
  ab: (a: A) => B,
  bc: (b: B) => C,
  cd: (c: C) => D,
): (a: A) => D;
export function pipe<A, B, C, D, E>(
  ab: (a: A) => B,
  bc: (b: B) => C,
  cd: (c: C) => D,
  de: (d: D) => E,
): (a: A) => E;
export function pipe<A, B, C, D, E, F>(
  ab: (a: A) => B,
  bc: (b: B) => C,
  cd: (c: C) => D,
  de: (d: D) => E,
  ef: (e: E) => F,
): (a: A) => F;
export function pipe<A, B, C, D, E, F, G>(
  ab: (a: A) => B,
  bc: (b: B) => C,
  cd: (c: C) => D,
  de: (d: D) => E,
  ef: (e: E) => F,
  fg: (f: F) => G,
): (a: A) => G;
export function pipe<A, B, C, D, E, F, G, H>(
  ab: (a: A) => B,
  bc: (b: B) => C,
  cd: (c: C) => D,
  de: (d: D) => E,
  ef: (e: E) => F,
  fg: (f: F) => G,
  gh: (g: G) => H,
): (a: A) => H;
export function pipe<A, B, C, D, E, F, G, H, I>(
  ab: (a: A) => B,
  bc: (b: B) => C,
  cd: (c: C) => D,
  de: (d: D) => E,
  ef: (e: E) => F,
  fg: (f: F) => G,
  gh: (g: G) => H,
  hi: (h: H) => I,
): (a: A) => I;
export function pipe(
  ...fns: Array<(a: unknown) => unknown>
): (a: unknown) => unknown {
  return (a) => fns.reduce((acc, fn) => fn(acc), a);
}

/**
 * Compose multiple functions from right to left
 */
export function compose(): <A>(a: A) => A;
export function compose<A, B>(ab: (a: A) => B): (a: A) => B;
export function compose<A, B, C>(bc: (b: B) => C, ab: (a: A) => B): (a: A) => C;
export function compose<A, B, C, D>(
  cd: (c: C) => D,
  bc: (b: B) => C,
  ab: (a: A) => B,
): (a: A) => D;
export function compose<A, B, C, D, E>(
  de: (d: D) => E,
  cd: (c: C) => D,
  bc: (b: B) => C,
  ab: (a: A) => B,
): (a: A) => E;
export function compose<A, B, C, D, E, F>(
  ef: (e: E) => F,
  de: (d: D) => E,
  cd: (c: C) => D,
  bc: (b: B) => C,
  ab: (a: A) => B,
): (a: A) => F;
export function compose<A, B, C, D, E, F, G>(
  fg: (f: F) => G,
  ef: (e: E) => F,
  de: (d: D) => E,
  cd: (c: C) => D,
  bc: (b: B) => C,
  ab: (a: A) => B,
): (a: A) => G;
export function compose<A, B, C, D, E, F, G, H>(
  gh: (g: G) => H,
  fg: (f: F) => G,
  ef: (e: E) => F,
  de: (d: D) => E,
  cd: (c: C) => D,
  bc: (b: B) => C,
  ab: (a: A) => B,
): (a: A) => H;
export function compose<A, B, C, D, E, F, G, H, I>(
  hi: (h: H) => I,
  gh: (g: G) => H,
  fg: (f: F) => G,
  ef: (e: E) => F,
  de: (d: D) => E,
  cd: (c: C) => D,
  bc: (b: B) => C,
  ab: (a: A) => B,
): (a: A) => I;
export function compose(
  ...fns: Array<(a: unknown) => unknown>
): (a: unknown) => unknown {
  return (a) => fns.reduceRight((acc, fn) => fn(acc), a);
}

/**
 * Flip the order of arguments for a binary function
 */
export const flip =
  <A, B, C>(f: (a: A) => (b: B) => C): ((b: B) => (a: A) => C) =>
  (b: B) =>
  (a: A) =>
    f(a)(b);

/**
 * Curried version of applying a function
 */
export const curry =
  <A, B, C>(f: (a: A, b: B) => C): ((a: A) => (b: B) => C) =>
  (a: A) =>
  (b: B) =>
    f(a, b);

/**
 * Uncurry a function
 */
export const uncurry =
  <A, B, C>(f: (a: A) => (b: B) => C): ((a: A, b: B) => C) =>
  (a: A, b: B) =>
    f(a)(b);

// ---------------------------------------------------------------------------
// Predicates and Boolean logic
// ---------------------------------------------------------------------------

/**
 * Logical AND for predicates
 */
export const and =
  <A>(p1: (a: A) => boolean) =>
  (p2: (a: A) => boolean) =>
  (a: A) =>
    p1(a) && p2(a);

/**
 * Logical OR for predicates
 */
export const or =
  <A>(p1: (a: A) => boolean) =>
  (p2: (a: A) => boolean) =>
  (a: A) =>
    p1(a) || p2(a);

/**
 * Logical NOT for predicates
 */
export const not =
  <A>(p: (a: A) => boolean) =>
  (a: A) =>
    !p(a);

/**
 * Always return true
 */
export const constTrue = (): boolean => true;

/**
 * Always return false
 */
export const constFalse = (): boolean => false;

// ---------------------------------------------------------------------------
// Tuple & Record operations
// ---------------------------------------------------------------------------

/**
 * Create a tuple from two values
 */
export const tuple = <A, B>(a: A, b: B): [A, B] => [a, b];

/**
 * Get the first element of a tuple
 */
export const fst = <A>([a]: [A, unknown]) => a;

/**
 * Get the second element of a tuple
 */
export const snd = <B>([, b]: [unknown, B]) => b;

/**
 * Swap the elements of a tuple
 */
export const swap = <A, B>([a, b]: [A, B]): [B, A] => [b, a];

// ---------------------------------------------------------------------------
// Option/Maybe related
// ---------------------------------------------------------------------------

/**
 * Return a Some value if it satisfies a predicate, otherwise return None
 */
export const fromPredicate =
  <A>(p: (a: A) => boolean) =>
  (a: A): Maybe<A> =>
    p(a) ? Maybe.of(a) : new None();

/**
 * Get a value from a record safely, returning None if the key doesn't exist
 */
export const lookup = <A>(key: string, obj: Record<string, A>): Maybe<A> =>
  key in obj ? Maybe.of(obj[key]) : new None();

// ---------------------------------------------------------------------------
// Either related
// ---------------------------------------------------------------------------

/**
 * Convert a function that might throw to an Either
 */
export const tryCatch =
  <A, B>(f: (a: A) => B) =>
  (a: A): Either<Error, B> => {
    try {
      return new Right(f(a));
    } catch (error: unknown) {
      return new Left(
        error instanceof Error ? error : new Error(String(error)),
      );
    }
  };

/**
 * Create a list containing a single element
 */
export const singleton = <A>(a: A) => List.of(a);

// ---------------------------------------------------------------------------
// Higher-order utilities and combinators
// ---------------------------------------------------------------------------

/**
 * Apply a function to a value and return the original value
 */
export const tap =
  <A>(f: (a: A) => void) =>
  (a: A) => {
    f(a);
    return a;
  };

// ---------------------------------------------------------------------------
// Debugging utilities
// ---------------------------------------------------------------------------

/**
 * Debug utility to log a value and pass it through
 * Only use this function during development and testing
 */
export const trace =
  <A>(message: string) =>
  (a: A) => {
    // eslint-disable-next-line no-console
    console.log(`${message}:`, a);
    return a;
  };

import { HKT2 } from "../hkt.js";
import { Applicative2 } from "../typeclass/applicative-tc.js";
import { Functor2 } from "../typeclass/functor-tc.js";
import { Monad2 } from "../typeclass/monad-tc.js";

export const eitherURI = "Either";
export type EitherURI = typeof eitherURI;

declare module "../hkt" {
  interface URItoKind2<E, A> {
    readonly [eitherURI]: Either<E, A>;
  }
}

type _E<E> = { _type: "left"; _E: E };
type _A<A> = { _type: "right"; _A: A };
type Value<E, A> = _E<E> | _A<A>;

export class Either<E, A> {
  readonly URI: EitherURI = eitherURI;
  readonly #value: Value<E, A>;

  constructor(value: Value<E, A>) {
    this.#value = value;
  }

  static of<A>(x: A): Either<never, A> {
    return new Right(x);
  }

  equals(other: Either<unknown, unknown>): boolean {
    switch (this.#value._type) {
      case "left":
        return (
          other.#value._type === "left" && this.#value._E === other.#value._E
        );
      case "right":
        return (
          other.#value._type === "right" && this.#value._A === other.#value._A
        );
      default:
        const exhaustiveCheck: never = this.#value;
        return exhaustiveCheck; // https://www.typescriptlang.org/docs/handbook/2/narrowing.html#exhaustiveness-checking
    }
  }

  map<B>(f: (a: A) => B): Either<E, B> {
    switch (this.#value._type) {
      case "left":
        return this as unknown as Left<E>;
      case "right":
        return Either.of(f(this.#value._A));
      default:
        const exhaustiveCheck: never = this.#value;
        return exhaustiveCheck;
    }
  }

  ap<E_, A_, B>(
    this: Either<E_, (a: A_) => B>,
    fa: Either<E_, A_>,
  ): Either<E_, B> {
    switch (this.#value._type) {
      case "left":
        return this as unknown as Left<E_>;
      case "right":
        return fa.map(this.#value._A);
      default:
        const exhaustiveCheck: never = this.#value;
        return exhaustiveCheck;
    }
  }

  flatMap<B>(f: (a: A) => Either<E, B>): Either<E, B> {
    switch (this.#value._type) {
      case "left":
        return this as unknown as Left<E>;
      case "right":
        return f(this.#value._A);
      default:
        const exhaustiveCheck: never = this.#value;
        return exhaustiveCheck;
    }
  }

  join<E_, A_>(this: Either<E_, Either<E_, A_>>): Either<E_, A_> {
    switch (this.#value._type) {
      case "left":
        return this as unknown as Left<E_>;
      case "right":
        return this.#value._A;
      default:
        const exhaustiveCheck: never = this.#value;
        return exhaustiveCheck;
    }
  }
}

export class Left<E> extends Either<E, never> {
  constructor(x: E) {
    super({ _type: "left", _E: x });
  }
}

export class Right<A> extends Either<never, A> {
  constructor(x: A) {
    super({ _type: "right", _A: x });
  }
}

export const eitherFunctor: Functor2<EitherURI> = {
  URI: eitherURI,
  map: <E, A, B>(fa: HKT2<EitherURI, E, A>, f: (a: A) => B) =>
    (fa as Either<E, A>).map(f),
};

export const eitherApplicative: Applicative2<EitherURI> = {
  ...eitherFunctor,
  of: Either.of.bind(Either),
  ap: <E, A, B>(
    ff: HKT2<EitherURI, E, (a: A) => B>,
    fa: HKT2<EitherURI, E, A>,
  ) => (ff as Either<E, (a: A) => B>).ap(fa as Either<E, A>),
};

export const eitherMonad: Monad2<EitherURI> = {
  ...eitherApplicative,
  flatMap: <E, A, B>(fa: HKT2<EitherURI, E, A>, f: (a: A) => Either<E, B>) =>
    (fa as Either<E, A>).flatMap(f),
};

import { Functor2 } from "./functor-typeclass.js";
import { HKT2 } from "./hkt.js";

export const eitherURI = "Either";
export type EitherURI = typeof eitherURI;

declare module "./hkt" {
  interface URItoKind2<E, A> {
    readonly [eitherURI]: Either<E, A>;
  }
}

type _E<E> = { _type: "left"; _E: E };
type _A<A> = { _type: "right"; _A: A };
type Value<E, A> = _E<E> | _A<A>;

export class Either<E, A> {
  readonly URI: EitherURI = eitherURI;
  readonly value: Value<E, A>;

  constructor(value: Value<E, A>) {
    this.value = value;
  }

  static of<A>(x: A): Either<never, A> {
    return new Right(x);
  }

  map<B>(f: (a: A) => B): Either<E, B> {
    switch (this.value._type) {
      case "left":
        return this as unknown as Left<E>;
      case "right":
        return Either.of(f(this.value._A));
      default:
        const exhaustiveCheck: never = this.value;
        return exhaustiveCheck; // https://www.typescriptlang.org/docs/handbook/2/narrowing.html#exhaustiveness-checking
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

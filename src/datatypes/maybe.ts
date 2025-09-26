import { HKT } from "../hkt.js";
import { Applicative1 } from "../typeclass/applicative-tc.js";
import { Functor1 } from "../typeclass/functor-tc.js";
import { Monad1 } from "../typeclass/monad-tc.js";

export const maybeURI = "Maybe";
export type MaybeURI = typeof maybeURI;

declare module "../hkt" {
  interface URItoKind<A> {
    readonly [maybeURI]: Maybe<A>;
  }
}

type _A<A> = { _type: "some"; _A: A };
type _None = { _type: "none" };
type Value<A> = _A<A> | _None;

export class Maybe<A> {
  readonly URI: MaybeURI = maybeURI;
  readonly #value: Value<A>;

  constructor(value: Value<A>) {
    this.#value = value;
  }

  static of<A>(x: A): Maybe<A> {
    return new Some(x);
  }

  equals(other: Maybe<unknown>): boolean {
    switch (this.#value._type) {
      case "some":
        return (
          other.#value._type === "some" && this.#value._A === other.#value._A
        );
      case "none":
        return other.#value._type === "none";
      default:
        const exhaustiveCheck: never = this.#value;
        return exhaustiveCheck; // https://www.typescriptlang.org/docs/handbook/2/narrowing.html#exhaustiveness-checking
    }
  }

  map<B>(f: (a: A) => B): Maybe<B> {
    switch (this.#value._type) {
      case "none":
        return this as unknown as Maybe<B>;
      case "some":
        return Maybe.of(f(this.#value._A));
      default:
        const exhaustiveCheck: never = this.#value;
        return exhaustiveCheck;
    }
  }

  ap<A_, B>(this: Maybe<(a: A_) => B>, fa: Maybe<A_>): Maybe<B> {
    switch (this.#value._type) {
      case "none":
        return this as unknown as Maybe<B>;
      case "some":
        return fa.map(this.#value._A);
      default:
        const exhaustiveCheck: never = this.#value;
        return exhaustiveCheck;
    }
  }

  flatMap<B>(f: (a: A) => Maybe<B>): Maybe<B> {
    switch (this.#value._type) {
      case "none":
        return this as unknown as Maybe<B>;
      case "some":
        return f(this.#value._A);
      default:
        const exhaustiveCheck: never = this.#value;
        return exhaustiveCheck;
    }
  }

  join<A_>(this: Maybe<Maybe<A_>>): Maybe<A_> {
    switch (this.#value._type) {
      case "none":
        return this as Maybe<A_>;
      case "some":
        return this.#value._A;
      default:
        const exhaustiveCheck: never = this.#value;
        return exhaustiveCheck;
    }
  }
}

export class Some<A> extends Maybe<A> {
  constructor(x: A) {
    super({ _type: "some", _A: x });
  }
}

export class None extends Maybe<never> {
  constructor() {
    super({ _type: "none" });
  }
}

export const maybeFunctor: Functor1<MaybeURI> = {
  URI: maybeURI,
  map: <A, B>(fa: HKT<MaybeURI, A>, f: (a: A) => B) => (fa as Maybe<A>).map(f),
};

export const maybeApplicative: Applicative1<MaybeURI> = {
  ...maybeFunctor,
  of: Maybe.of.bind(Maybe),
  ap: <A, B>(ff: HKT<MaybeURI, (a: A) => B>, fa: HKT<MaybeURI, A>) =>
    (ff as Maybe<(a: A) => B>).ap(fa as Maybe<A>),
};

export const maybeMonad: Monad1<MaybeURI> = {
  ...maybeApplicative,
  flatMap: <A, B>(fa: HKT<MaybeURI, A>, f: (a: A) => Maybe<B>) =>
    (fa as Maybe<A>).flatMap(f),
};

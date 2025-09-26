import { Functor1 } from "./functor-typeclass.js";
import { HKT } from "./hkt.js";

export const maybeURI = "Maybe";
export type MaybeURI = typeof maybeURI;

declare module "./hkt" {
  interface URItoKind<A> {
    readonly [maybeURI]: Maybe<A>;
  }
}

type _A<A> = { _type: "some"; _A: A };
type _None = { _type: "none" };
type Value<A> = _A<A> | _None;

export class Maybe<A> {
  readonly URI: MaybeURI = maybeURI;
  value: Value<A>;

  constructor(value: Value<A>) {
    this.value = value;
  }

  static of<A>(x: A): Maybe<A> {
    return new Some(x);
  }

  map<B>(f: (a: A) => B): Maybe<B> {
    switch (this.value._type) {
      case "none":
        return this as unknown as Maybe<B>;
      case "some":
        return Maybe.of(f(this.value._A));
      default:
        const exhaustiveCheck: never = this.value;
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

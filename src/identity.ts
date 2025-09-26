import { Functor1 } from "./functor-typeclass.js";
import { HKT } from "./hkt.js";

export const identityURI = "Identity";
export type IdentityURI = typeof identityURI;

declare module "./hkt" {
  interface URItoKind<A> {
    readonly [identityURI]: Identity<A>;
  }
}

type _A<A> = { _type: "identity"; _A: A };
type Value<A> = _A<A>;

export class Identity<A> {
  readonly URI: IdentityURI = identityURI;
  readonly #value: Value<A>;

  constructor(value: Value<A>) {
    this.#value = value;
  }

  static of<A>(x: A): Identity<A> {
    return new Identity({ _type: "identity", _A: x });
  }

  equals(other: Identity<unknown>): boolean {
    return this.#value._A === other.#value._A;
  }

  map<B>(f: (a: A) => B): Identity<B> {
    return Identity.of(f(this.#value._A));
  }
}

export const identityFunctor: Functor1<IdentityURI> = {
  URI: identityURI,
  map: <A, B>(fa: HKT<IdentityURI, A>, f: (a: A) => B) =>
    (fa as Identity<A>).map(f),
};

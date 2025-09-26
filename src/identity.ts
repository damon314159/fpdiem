import { HKT } from "./hkt.js";
import { Applicative1 } from "./typeclass/applicative-tc.js";
import { Functor1 } from "./typeclass/functor-tc.js";
import { Monad1 } from "./typeclass/monad-tc.js";

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

  ap<A_, B>(this: Identity<(a: A_) => B>, fa: Identity<A_>): Identity<B> {
    return fa.map(this.#value._A);
  }

  flatMap<B>(f: (a: A) => Identity<B>): Identity<B> {
    return f(this.#value._A);
  }

  join<A_>(this: Identity<Identity<A_>>): Identity<A_> {
    return this.#value._A;
  }
}

export const identityFunctor: Functor1<IdentityURI> = {
  URI: identityURI,
  map: <A, B>(fa: HKT<IdentityURI, A>, f: (a: A) => B) =>
    (fa as Identity<A>).map(f),
};

export const identityApplicative: Applicative1<IdentityURI> = {
  ...identityFunctor,
  of: Identity.of.bind(Identity),
  ap: <A, B>(ff: HKT<IdentityURI, (a: A) => B>, fa: HKT<IdentityURI, A>) =>
    (ff as Identity<(a: A) => B>).ap(fa as Identity<A>),
};

export const identityMonad: Monad1<IdentityURI> = {
  ...identityApplicative,
  flatMap: <A, B>(fa: HKT<IdentityURI, A>, f: (a: A) => Identity<B>) =>
    (fa as Identity<A>).flatMap(f),
};

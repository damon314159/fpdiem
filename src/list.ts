import { HKT } from "./hkt.js";
import { Applicative1 } from "./typeclass/applicative-tc.js";
import { Functor1 } from "./typeclass/functor-tc.js";
import { Monad1 } from "./typeclass/monad-tc.js";

export const listURI = "List";
export type ListURI = typeof listURI;

declare module "./hkt" {
  interface URItoKind<A> {
    readonly [listURI]: List<A>;
  }
}

type _A<A> = { _type: "list"; _A: A[] };
type Value<A> = _A<A>;

export class List<A> {
  readonly URI: ListURI = listURI;
  readonly #value: Value<A>;

  constructor(value: Value<A>) {
    this.#value = value;
  }

  static of<A>(x: A): List<A> {
    return new List({ _type: "list", _A: [x] });
  }

  static from<A>(arr: A[]): List<A> {
    return new List({ _type: "list", _A: arr });
  }

  static empty<A>(): List<A> {
    return List.from([]);
  }

  equals(other: List<unknown>): boolean {
    return (
      this.#value._A.length === other.#value._A.length &&
      this.#value._A.every((a, index) => a === other.#value._A[index])
    );
  }

  map<B>(f: (a: A) => B): List<B> {
    return List.from(this.#value._A.map(f));
  }

  ap<A_, B>(this: List<(a: A_) => B>, fa: List<A_>): List<B> {
    return this.flatMap((fn) => fa.map(fn));
  }

  flatMap<B>(f: (a: A) => List<B>): List<B> {
    return this.map(f).join();
  }

  join<A_>(this: List<List<A_>>): List<A_> {
    const flatArr = this.#value._A.flatMap((list) => list.#value._A);
    return List.from(flatArr);
  }
}

export const listFunctor: Functor1<ListURI> = {
  URI: listURI,
  map: <A, B>(fa: HKT<ListURI, A>, f: (a: A) => B) =>
    (fa as unknown as List<A>).map(f),
};

export const listApplicative: Applicative1<ListURI> = {
  ...listFunctor,
  of: List.of.bind(List),
  ap: <A, B>(ff: HKT<ListURI, (a: A) => B>, fa: HKT<ListURI, A>) =>
    (ff as List<(a: A) => B>).ap(fa as List<A>),
};

export const listMonad: Monad1<ListURI> = {
  ...listApplicative,
  flatMap: <A, B>(fa: HKT<ListURI, A>, f: (a: A) => List<B>) =>
    (fa as List<A>).flatMap(f),
};

import { Functor1 } from "./functor-typeclass.js";
import { HKT } from "./hkt.js";

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
}

export const listFunctor: Functor1<ListURI> = {
  URI: listURI,
  map: <A, B>(fa: HKT<ListURI, A>, f: (a: A) => B) =>
    (fa as unknown as List<A>).map(f),
};

import { Functor2 } from "./functor.js";
import { HKT2, Kind2, URIS2 } from "./hkt.js";

const eitherURI = "Either";
type EitherURI = typeof eitherURI;

const mapURI = "map";
type MapURI = typeof mapURI;

class Map<E, A> {
  readonly URI: MapURI = mapURI;
  readonly value: Map<E, A>;

  constructor(map: Map<E, A>) {
    this.value = map;
  }
}

declare module "./hkt" {
  interface URItoKind2<E, A> {
    readonly [eitherURI]: Either<E, A>;
    readonly [mapURI]: Map<E, A>;
  }
}

type _E<E> = { _type: "left"; _E: E };
type _A<A> = { _type: "right"; _A: A };
type Value<E, A> = _E<E> | _A<A>;

export class Either<E, A> {
  readonly URI: EitherURI = eitherURI;
  value: Value<E, A>;

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

class Left<E> extends Either<E, never> {
  constructor(x: E) {
    super({ _type: "left", _E: x });
  }
}

class Right<A> extends Either<never, A> {
  constructor(x: A) {
    super({ _type: "right", _A: x });
  }
}

type Functor2URIS = URIS2 & (EitherURI | MapURI);
type Functor2Instances = {
  [K in Functor2URIS]: Functor2<K>;
};
const functor2Instances: Functor2Instances = {
  // [mapURI]: {
  //   URI: mapURI,
  //   map: <E, A, B>(fa, f) => new Map<E, B>(fa) as unknown as HKT2<"map", E, B>, // mock map, doesn't matter
  // },
  [eitherURI]: {
    URI: eitherURI,
    map: <E, A, B>(fa: HKT2<EitherURI, E, A>, f: (a: A) => B) =>
      (fa as Either<E, A>).map(f),
  },
} satisfies Functor2Instances;

function map2<E, A, B>(f: (a: A) => B) {
  return <F extends Functor2URIS>(fa: HKT2<F, E, A>): Kind2<F, E, B> => {
    const instance = functor2Instances[fa.URI];
    return instance.map(fa, f);
  };
}

const double = map2((x: number) => `${2 * x}`);
// double is <F extends Functor2URIS>(fa: HKT2<F, unknown, number>) => Kind2<F, unknown, string>
const result = double(new Right(5));
// result is Either<unknown, string>

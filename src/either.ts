import { Functor2 } from "./functor.js";
import { URIS2, URItoKind2 } from "./hkt.js";

const eitherURI = "Either";
type EitherURI = typeof eitherURI;

declare module "./hkt" {
  interface URItoKind2<E, A> {
    readonly [eitherURI]: Either<E, A>;
  }
}

type L<E> = { _type: "left"; left: E };
type R<A> = { _type: "right"; right: A };
type Value<E, A> = L<E> | R<A>;

export class Either<E, A> implements Functor2<EitherURI> {
  readonly URI: EitherURI = eitherURI;
  value: Value<E, A>;

  constructor(value: Value<E, A>) {
    this.value = value;
  }

  static of<A>(x: A): Right<A> {
    return new Right(x);
  }
  readonly of = Either.of.bind(Either);

  static map<E, A, B>(fa: Either<E, A>, f: (a: A) => B): Either<E, B> {
    switch (fa.value._type) {
      case "left":
        return fa as Left<E>;
      case "right":
        return Either.of(f(fa.value.right));
      default:
        const exhaustiveCheck: never = fa.value;
        return exhaustiveCheck; // https://www.typescriptlang.org/docs/handbook/2/narrowing.html#exhaustiveness-checking
    }
  }
  readonly map = Either.map.bind(Either);
}

class Right<A> extends Either<never, A> {
  constructor(x: A) {
    super({ _type: "right", right: x });
  }
}

class Left<E> extends Either<E, never> {
  constructor(x: E) {
    super({ _type: "left", left: x });
  }
}

const functorInstances: {
  [K in URIS2]: Functor2<K>;
} = {
  Either: {
    URI: "Either",
    map: (fa, f) => Either.map(fa, f),
  },
};

function map2<E, A, B>(f: (a: A) => B) {
  return <F extends URIS2>(fa: URItoKind2<E, A>[F]): URItoKind2<E, B>[F] => {
    const instance = functorInstances[fa.URI];
    return instance.map(fa, f);
  };
}

const mapper = map2((x: number) => `${2 * x}`);
// mapper is correctly <F extends URIS2>(fa: URItoKind2<unknown, number>[F]) => URItoKind2<unknown, string>[F]
const result = mapper(new Right(5));
// result is correctly typed as Either<unknown, string>

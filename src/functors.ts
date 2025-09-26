import { eitherFunctor, eitherURI, EitherURI } from "./either.js";
import { Functor1, Functor2, Functor3, Functor4 } from "./functor-typeclass.js";
import {
  HKT,
  HKT2,
  HKT3,
  HKT4,
  Kind,
  Kind2,
  Kind3,
  Kind4,
  URIS,
  URIS2,
  URIS3,
  URIS4,
} from "./hkt.js";

type Functor1URIS = URIS;
type Functor1Instances = {
  [K in Functor1URIS]: Functor1<K>;
};
type Functor2URIS = URIS2 & (EitherURI | "");
type Functor2Instances = {
  [K in Functor2URIS]: Functor2<K>;
};
type Functor3URIS = URIS3;
type Functor3Instances = {
  [K in Functor3URIS]: Functor3<K>;
};
type Functor4URIS = URIS4;
type Functor4Instances = {
  [K in Functor4URIS]: Functor4<K>;
};
// eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents, @typescript-eslint/no-duplicate-type-constituents
type FunctorURIS = Functor1URIS | Functor2URIS | Functor3URIS | Functor4URIS;
type FunctorInstances = Functor1Instances &
  Functor2Instances &
  Functor3Instances &
  Functor4Instances;

const functor1Instances: Functor1Instances = {
  // Add instances for Functor1 here if needed
} satisfies Functor1Instances;
const functor2Instances: Functor2Instances = {
  [eitherURI]: eitherFunctor,
} satisfies Functor2Instances;
const functor3Instances: Functor3Instances = {
  // Add instances for Functor3 here if needed
} satisfies Functor3Instances;
const functor4Instances: Functor4Instances = {
  // Add instances for Functor4 here if needed
} satisfies Functor4Instances;
const functorInstances: FunctorInstances = {
  ...functor1Instances,
  ...functor2Instances,
  ...functor3Instances,
  ...functor4Instances,
} satisfies FunctorInstances;

export type Mapper1<A, B> = <F extends Functor1URIS>(
  fa: HKT<F, A>,
) => Kind<F, B>;
export type Mapper2<A, B> = <F extends Functor2URIS, E>(
  fa: HKT2<F, E, A>,
) => Kind2<F, E, B>;
export type Mapper3<A, B> = <F extends Functor3URIS, R, E>(
  fa: HKT3<F, R, E, A>,
) => Kind3<F, R, E, B>;
export type Mapper4<A, B> = <F extends Functor4URIS, S, R, E>(
  fa: HKT4<F, S, R, E, A>,
) => Kind4<F, S, R, E, B>;
export type Mapper<A, B> = Mapper1<A, B> &
  Mapper2<A, B> &
  Mapper3<A, B> &
  Mapper4<A, B>;

export function map<A, B>(f: (a: A) => B): Mapper<A, B> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return <F extends FunctorURIS>(fa: { URI: F; value: any }): any => {
    const instance = functorInstances[fa.URI];
    return instance.map(fa, f);
  };
}

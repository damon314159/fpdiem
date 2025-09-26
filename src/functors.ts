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
import { identityFunctor, identityURI, IdentityURI } from "./identity.js";
import { listFunctor, listURI, ListURI } from "./list.js";
import { maybeFunctor, maybeURI, MaybeURI } from "./maybe.js";

export type Functor1URIS = URIS & (IdentityURI | ListURI | MaybeURI);
export type Functor1Instances = {
  [K in Functor1URIS]: Functor1<K>;
};
export type Functor2URIS = URIS2 & EitherURI;
export type Functor2Instances = {
  [K in Functor2URIS]: Functor2<K>;
};
export type Functor3URIS = URIS3;
export type Functor3Instances = {
  [K in Functor3URIS]: Functor3<K>;
};
export type Functor4URIS = URIS4;
export type Functor4Instances = {
  [K in Functor4URIS]: Functor4<K>;
};
export type FunctorURIS =
  | Functor1URIS
  | Functor2URIS
  // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents, @typescript-eslint/no-duplicate-type-constituents
  | Functor3URIS
  // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents, @typescript-eslint/no-duplicate-type-constituents
  | Functor4URIS;
export type FunctorInstances = Functor1Instances &
  Functor2Instances &
  Functor3Instances &
  Functor4Instances;

export const functor1Instances: Functor1Instances = {
  [identityURI]: identityFunctor,
  [listURI]: listFunctor,
  [maybeURI]: maybeFunctor,
} satisfies Functor1Instances;
export const functor2Instances: Functor2Instances = {
  [eitherURI]: eitherFunctor,
} satisfies Functor2Instances;
export const functor3Instances: Functor3Instances = {
  // Add instances for Functor3 here if needed
} satisfies Functor3Instances;
export const functor4Instances: Functor4Instances = {
  // Add instances for Functor4 here if needed
} satisfies Functor4Instances;
export const functorInstances: FunctorInstances = {
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
  return <F extends FunctorURIS>(fa: { URI: F }): any => {
    const instance = functorInstances[fa.URI];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (instance.map as (fa: any, f: (a: any) => any) => any)(fa, f);
  };
}

import { eitherMonad, eitherURI, EitherURI } from "../either.js";
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
} from "../hkt.js";
import { identityMonad, identityURI, IdentityURI } from "../identity.js";
import { listMonad, listURI, ListURI } from "../list.js";
import { maybeMonad, maybeURI, MaybeURI } from "../maybe.js";
import { Monad1, Monad2, Monad3, Monad4 } from "./monad-tc.js";

export type Monad1URIS = URIS & (IdentityURI | ListURI | MaybeURI);
export type Monad1Instances = {
  [K in Monad1URIS]: Monad1<K>;
};
export type Monad2URIS = URIS2 & EitherURI;
export type Monad2Instances = {
  [K in Monad2URIS]: Monad2<K>;
};
export type Monad3URIS = URIS3;
export type Monad3Instances = {
  [K in Monad3URIS]: Monad3<K>;
};
export type Monad4URIS = URIS4;
export type Monad4Instances = {
  [K in Monad4URIS]: Monad4<K>;
};
export type MonadURIS =
  | Monad1URIS
  | Monad2URIS
  // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents, @typescript-eslint/no-duplicate-type-constituents
  | Monad3URIS
  // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents, @typescript-eslint/no-duplicate-type-constituents
  | Monad4URIS;
export type MonadInstances = Monad1Instances &
  Monad2Instances &
  Monad3Instances &
  Monad4Instances;

export const monad1Instances: Monad1Instances = {
  [identityURI]: identityMonad,
  [listURI]: listMonad,
  [maybeURI]: maybeMonad,
} satisfies Monad1Instances;
export const monad2Instances: Monad2Instances = {
  [eitherURI]: eitherMonad,
} satisfies Monad2Instances;
export const monad3Instances: Monad3Instances = {
  // Add instances for Monad3 here if needed
} satisfies Monad3Instances;
export const monad4Instances: Monad4Instances = {
  // Add instances for Monad4 here if needed
} satisfies Monad4Instances;
export const monadInstances: MonadInstances = {
  ...monad1Instances,
  ...monad2Instances,
  ...monad3Instances,
  ...monad4Instances,
} satisfies MonadInstances;

export type Mapper1<A, B> = <F extends Monad1URIS>(fa: HKT<F, A>) => Kind<F, B>;
export type Mapper2<A, B> = <F extends Monad2URIS, E>(
  fa: HKT2<F, E, A>,
) => Kind2<F, E, B>;
export type Mapper3<A, B> = <F extends Monad3URIS, R, E>(
  fa: HKT3<F, R, E, A>,
) => Kind3<F, R, E, B>;
export type Mapper4<A, B> = <F extends Monad4URIS, S, R, E>(
  fa: HKT4<F, S, R, E, A>,
) => Kind4<F, S, R, E, B>;
export type Mapper<A, B> = Mapper1<A, B> &
  Mapper2<A, B> &
  Mapper3<A, B> &
  Mapper4<A, B>;

// prettier-ignore
export type FlatMap<F extends MonadURIS, S, R, E, A, B> =
  F extends Monad1URIS ? (a: A) => Kind<F, B> :
  F extends Monad2URIS ? (a: A) => Kind2<F, E, B> :
  F extends Monad3URIS ? (a: A) => Kind3<F, R, E, B> :
  F extends Monad4URIS ? (a: A) => Kind4<F, S, R, E, B> : never

// prettier-ignore
export type Mappable<F extends MonadURIS, S, R, E, A> =
  F extends Monad1URIS ? HKT<F, A> :
  F extends Monad2URIS ? HKT2<F, E, A> :
  F extends Monad3URIS ? HKT3<F, R, E, A> :
  F extends Monad4URIS ? HKT4<F, S, R, E, A> : never

// prettier-ignore
export type Mapped<F extends MonadURIS, S, R, E, B> =
  F extends Monad1URIS ? Kind<F, B> :
  F extends Monad2URIS ? Kind2<F, E, B> :
  F extends Monad3URIS ? Kind3<F, R, E, B> :
  F extends Monad4URIS ? Kind4<F, S, R, E, B> : never

export function flatMap<F extends Monad1URIS, A, B>(
  f: (a: A) => Kind<F, B>,
): (fa: HKT<F, A>) => Kind<F, B>;
export function flatMap<F extends Monad2URIS, E, A, B>(
  f: (a: A) => Kind2<F, E, B>,
): (fa: HKT2<F, E, A>) => Kind2<F, E, B>;
export function flatMap<F extends Monad3URIS, R, E, A, B>(
  f: (a: A) => Kind3<F, R, E, B>,
): (fa: HKT3<F, R, E, A>) => Kind3<F, R, E, B>;
export function flatMap<F extends Monad4URIS, S, R, E, A, B>(
  f: (a: A) => Kind4<F, S, R, E, B>,
): (fa: HKT4<F, S, R, E, A>) => Kind4<F, S, R, E, B>;

export function flatMap<F extends MonadURIS, S, R, E, A, B>(
  f: FlatMap<F, S, R, E, A, B>,
) {
  return (fa: Mappable<F, S, R, E, A>): Mapped<F, S, R, E, B> => {
    const instance = monadInstances[fa.URI];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (
      instance.flatMap as unknown as (
        fa: Mappable<F, S, R, E, A>,
        f: FlatMap<F, S, R, E, A, B>,
      ) => Mapped<F, S, R, E, B>
    )(fa, f);
  };
}

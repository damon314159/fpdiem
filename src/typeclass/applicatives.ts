import {
  eitherApplicative,
  eitherURI,
  EitherURI,
} from "../datatypes/either.js";
import {
  identityApplicative,
  identityURI,
  IdentityURI,
} from "../datatypes/identity.js";
import { listApplicative, listURI, ListURI } from "../datatypes/list.js";
import { maybeApplicative, maybeURI, MaybeURI } from "../datatypes/maybe.js";
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
import {
  Applicative1,
  Applicative2,
  Applicative3,
  Applicative4,
} from "./applicative-tc.js";

export type Applicative1URIS = URIS & (IdentityURI | ListURI | MaybeURI);
export type Applicative1Instances = {
  [K in Applicative1URIS]: Applicative1<K>;
};
export type Applicative2URIS = URIS2 & EitherURI;
export type Applicative2Instances = {
  [K in Applicative2URIS]: Applicative2<K>;
};
export type Applicative3URIS = URIS3;
export type Applicative3Instances = {
  [K in Applicative3URIS]: Applicative3<K>;
};
export type Applicative4URIS = URIS4;
export type Applicative4Instances = {
  [K in Applicative4URIS]: Applicative4<K>;
};
export type ApplicativeURIS =
  | Applicative1URIS
  | Applicative2URIS
  // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents, @typescript-eslint/no-duplicate-type-constituents
  | Applicative3URIS
  // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents, @typescript-eslint/no-duplicate-type-constituents
  | Applicative4URIS;
export type ApplicativeInstances = Applicative1Instances &
  Applicative2Instances &
  Applicative3Instances &
  Applicative4Instances;

export const applicative1Instances: Applicative1Instances = {
  [identityURI]: identityApplicative,
  [listURI]: listApplicative,
  [maybeURI]: maybeApplicative,
} satisfies Applicative1Instances;
export const applicative2Instances: Applicative2Instances = {
  [eitherURI]: eitherApplicative,
} satisfies Applicative2Instances;
export const applicative3Instances: Applicative3Instances = {
  // Add instances for Applicative3 here if needed
} satisfies Applicative3Instances;
export const applicative4Instances: Applicative4Instances = {
  // Add instances for Applicative4 here if needed
} satisfies Applicative4Instances;
export const applicativeInstances: ApplicativeInstances = {
  ...applicative1Instances,
  ...applicative2Instances,
  ...applicative3Instances,
  ...applicative4Instances,
} satisfies ApplicativeInstances;

// prettier-ignore
export type Applicable<F extends ApplicativeURIS, S, R, E, A, B> =
  F extends Applicative1URIS ? HKT<F, (a: A) => B> :
  F extends Applicative2URIS ? HKT2<F, E, (a: A) => B> :
  F extends Applicative3URIS ? HKT3<F, R, E, (a: A) => B> :
  F extends Applicative4URIS ? HKT4<F, S, R, E, (a: A) => B> : never

// prettier-ignore
export type ApplicableTo<F extends ApplicativeURIS, S, R, E, A> =
  F extends Applicative1URIS ? HKT<F, A> :
  F extends Applicative2URIS ? HKT2<F, E, A> :
  F extends Applicative3URIS ? HKT3<F, R, E, A> :
  F extends Applicative4URIS ? HKT4<F, S, R, E, A> : never

// prettier-ignore
export type ApplicableResult<F extends ApplicativeURIS, S, R, E, B> =
  F extends Applicative1URIS ? Kind<F, B> :
  F extends Applicative2URIS ? Kind2<F, E, B> :
  F extends Applicative3URIS ? Kind3<F, R, E, B> :
  F extends Applicative4URIS ? Kind4<F, S, R, E, B> : never

export function ap<F extends Applicative1URIS, A, B>(
  ff: HKT<F, (a: A) => B>,
): (fa: HKT<F, A>) => Kind<F, B>;
export function ap<F extends Applicative2URIS, E, A, B>(
  ff: HKT2<F, E, (a: A) => B>,
): (fa: HKT2<F, E, A>) => Kind2<F, E, B>;
export function ap<F extends Applicative3URIS, R, E, A, B>(
  ff: HKT3<F, R, E, (a: A) => B>,
): (fa: HKT3<F, R, E, A>) => Kind3<F, R, E, B>;
export function ap<F extends Applicative4URIS, S, R, E, A, B>(
  ff: HKT4<F, S, R, E, (a: A) => B>,
): (fa: HKT4<F, S, R, E, A>) => Kind4<F, S, R, E, B>;

// function ap(ff) { return (fa) => applicativeInstances[fa.URI].ap(ff, fa) }
export function ap<F extends ApplicativeURIS, S, R, E, A, B>(
  ff: Applicable<F, S, R, E, A, B>,
) {
  return (fa: ApplicableTo<F, S, R, E, A>): ApplicableResult<F, S, R, E, B> => {
    const instance = applicativeInstances[fa.URI];
    return (
      instance.ap as unknown as (
        ff: Applicable<F, S, R, E, A, B>,
        fa: ApplicableTo<F, S, R, E, A>,
      ) => ApplicableResult<F, S, R, E, B>
    )(ff, fa);
  };
}

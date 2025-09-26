import { eitherApplicative, eitherURI, EitherURI } from "../either.js";
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
import { identityApplicative, identityURI, IdentityURI } from "../identity.js";
import { listApplicative, listURI, ListURI } from "../list.js";
import { maybeApplicative, maybeURI, MaybeURI } from "../maybe.js";
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

export function ap<F extends ApplicativeURIS, S, R, E, A, B>(
  // prettier-ignore
  ff: F extends Applicative1URIS ? HKT<F, (a: A) => B> :
      F extends Applicative2URIS ? HKT2<F, E, (a: A) => B> :
      F extends Applicative3URIS ? HKT3<F, R, E, (a: A) => B> :
      F extends Applicative4URIS ? HKT4<F, S, R, E, (a: A) => B> : never,
) {
  return ((fa: { URI: F }) => {
    const instance = applicativeInstances[fa.URI];
    // prettier-ignore
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (instance.ap as (ff: any, fa: any) => 
      F extends Applicative1URIS ? Kind<F, B> :
      F extends Applicative2URIS ? Kind2<F, E, B> :
      F extends Applicative3URIS ? Kind3<F, R, E, B> :
      F extends Applicative4URIS ? Kind4<F, S, R, E, B> : never
    )(ff, fa);
  }) as F extends Applicative1URIS
    ? (fa: HKT<F, A>) => Kind<F, B>
    : F extends Applicative2URIS
      ? (fa: HKT2<F, E, A>) => Kind2<F, E, B>
      : F extends Applicative3URIS
        ? (fa: HKT3<F, R, E, A>) => Kind3<F, R, E, B>
        : F extends Applicative4URIS
          ? (fa: HKT4<F, S, R, E, A>) => Kind4<F, S, R, E, B>
          : never;
}

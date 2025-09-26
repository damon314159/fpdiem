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

export interface Functor1<F extends URIS> {
  readonly URI: F;
  readonly map: <A, B>(fa: HKT<F, A>, f: (a: A) => B) => Kind<F, B>;
}

export interface Functor2<F extends URIS2> {
  readonly URI: F;
  readonly map: <E, A, B>(fa: HKT2<F, E, A>, f: (a: A) => B) => Kind2<F, E, B>;
}

export interface Functor3<F extends URIS3> {
  readonly URI: F;
  readonly map: <R, E, A, B>(
    fa: HKT3<F, R, E, A>,
    f: (a: A) => B,
  ) => Kind3<F, R, E, B>;
}

export interface Functor4<F extends URIS4> {
  readonly URI: F;
  readonly map: <S, R, E, A, B>(
    fa: HKT4<F, S, R, E, A>,
    f: (a: A) => B,
  ) => Kind4<F, S, R, E, B>;
}

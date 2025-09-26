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

export interface Monad1<F extends URIS> extends Applicative1<F> {
  readonly flatMap: <A, B>(
    fa: HKT<F, A>,
    f: (a: A) => Kind<F, B>,
  ) => Kind<F, B>;
}

export interface Monad2<F extends URIS2> extends Applicative2<F> {
  readonly flatMap: <E, A, B>(
    fa: HKT2<F, E, A>,
    f: (a: A) => Kind2<F, E, B>,
  ) => Kind2<F, E, B>;
}

export interface Monad3<F extends URIS3> extends Applicative3<F> {
  readonly flatMap: <R, E, A, B>(
    fa: HKT3<F, R, E, A>,
    f: (a: A) => Kind3<F, R, E, B>,
  ) => Kind3<F, R, E, B>;
}

export interface Monad4<F extends URIS4> extends Applicative4<F> {
  readonly flatMap: <S, R, E, A, B>(
    fa: HKT4<F, S, R, E, A>,
    f: (a: A) => Kind4<F, S, R, E, B>,
  ) => Kind4<F, S, R, E, B>;
}

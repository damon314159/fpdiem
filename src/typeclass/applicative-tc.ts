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
import { Functor1, Functor2, Functor3, Functor4 } from "./functor-tc.js";

export interface Applicative1<F extends URIS> extends Functor1<F> {
  readonly of: <A>(a: A) => Kind<F, A>;
  readonly ap: <A, B>(ff: HKT<F, (a: A) => B>, fa: HKT<F, A>) => Kind<F, B>;
}

export interface Applicative2<F extends URIS2> extends Functor2<F> {
  readonly of: <A>(a: A) => Kind2<F, never, A>;
  readonly ap: <E, A, B>(
    ff: HKT2<F, E, (a: A) => B>,
    fa: HKT2<F, E, A>,
  ) => Kind2<F, E, B>;
}

export interface Applicative3<F extends URIS3> extends Functor3<F> {
  readonly of: <A>(a: A) => Kind3<F, never, never, A>;
  readonly ap: <R, E, A, B>(
    ff: HKT3<F, R, E, (a: A) => B>,
    fa: HKT3<F, R, E, A>,
  ) => Kind3<F, R, E, B>;
}

export interface Applicative4<F extends URIS4> extends Functor4<F> {
  readonly of: <A>(a: A) => Kind4<F, never, never, never, A>;
  readonly ap: <S, R, E, A, B>(
    ff: HKT4<F, S, R, E, (a: A) => B>,
    fa: HKT4<F, S, R, E, A>,
  ) => Kind4<F, S, R, E, B>;
}

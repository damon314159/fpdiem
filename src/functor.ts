import { Kind, Kind2, URIS, URIS2 } from "./hkt.js";

export interface Functor1<F extends URIS> {
  readonly URI: F;
  readonly map: <A, B>(fa: Kind<F, A>, f: (a: A) => B) => Kind<F, B>;
}

export interface Functor2<F extends URIS2> {
  readonly URI: F;
  readonly map: <E, A, B>(fa: Kind2<F, E, A>, f: (a: A) => B) => Kind2<F, E, B>;
}

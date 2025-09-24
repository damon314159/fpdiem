export interface Functor<A> {
  map<B>(fn: (a: A) => B): Functor<B>;
}

export interface Functor2<E, A> {
  map<B>(fn: (a: A) => B): Functor2<E, B>;
}

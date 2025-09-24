import { Functor2 } from "./functor.js";

type L<E> = { _type: "left"; left: E };
type R<A> = { _type: "right"; right: A };
type Value<E, A> = L<E> | R<A>;

export class Either<E, A> implements Functor2<E, A> {
  #value: Value<E, A>;

  constructor(value: Value<E, A>) {
    this.#value = value;
  }

  static of<A>(x: A): Right<A> {
    return new Right(x);
  }

  isLeft(): this is Left<E> {
    return this.#value._type === "left";
  }
  isRight(): this is Right<A> {
    return this.#value._type === "right";
  }

  map<B>(fn: (a: A) => B): Either<E, B> {
    switch (this.#value._type) {
      case "left":
        return this as unknown as Left<E>;
      case "right":
        return Either.of(fn(this.#value.right));
      default:
        const exhaustiveCheck: never = this.#value;
        return exhaustiveCheck; // https://www.typescriptlang.org/docs/handbook/2/narrowing.html#exhaustiveness-checking
    }
  }
}

class Right<A> extends Either<never, A> {
  constructor(x: A) {
    super({ _type: "right", right: x });
  }
}

class Left<E> extends Either<E, never> {
  constructor(x: E) {
    super({ _type: "left", left: x });
  }
}

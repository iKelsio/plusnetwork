type Either<L, A> = Left<L, A> | Right<L, A>;

class Left<L, A> {
  readonly value: L;

  constructor(value: L) {
    this.value = value;
  }

  public isLeft(): this is Left<L, A> {
    return true;
  }

  public isRight(): this is Right<L, A> {
    return false;
  }
}

class Right<L, A> {
  readonly value: A;

  constructor(value: A) {
    this.value = value;
  }

  public isLeft(): this is Left<L, A> {
    return false;
  }

  public isRight(): this is Right<L, A> {
    return true;
  }
}

const left = <L, A>(l: L): Either<L, A> => new Left<L, A>(l);

const right = <L, A>(a: A): Either<L, A> => new Right<L, A>(a);

export { Either, left, right };

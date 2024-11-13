import { deepEqual } from 'fast-equals';

type Primitive = bigint | number | boolean | string | Date | symbol;

/**
 * @desc ValueObjects are objects that we determine their
 * equality through their structural property.
 */
abstract class ValueObject<T extends Primitive> {
  readonly value: T;

  constructor(value: T) {
    this.value = value;
  }

  public equalsTo(other: ValueObject<T>): boolean {
    return other.constructor.name === this.constructor.name && other.value === this.value && deepEqual(this, other);
  }

  public toString(): string {
    return this.value.toString();
  }
}

export { ValueObject, Primitive };

import { ValueObject } from './value-object';

abstract class NumberValueObject extends ValueObject<number> {
  public isBiggerThan(other: NumberValueObject): boolean {
    return this.value > other.value;
  }

  public isLessThan(other: NumberValueObject): boolean {
    return this.value < other.value;
  }
}

export { NumberValueObject };

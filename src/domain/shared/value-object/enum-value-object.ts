import { Guard } from '@domain/shared/core/logic';

abstract class EnumValueObject<T> {
  readonly value: T;

  protected constructor(
    value: T,
    public readonly validValues: T[]
  ) {
    this.checkIfValueIsValid(value);
    this.value = value;
  }

  public checkIfValueIsValid(value: T): void {
    if (Guard.isOneOf(value, this.validValues, 'Enum Value Object').failure) {
      this.throwErrorForInvalidValue(value);
    }
  }

  protected abstract throwErrorForInvalidValue(value: T): void;
}

export { EnumValueObject };

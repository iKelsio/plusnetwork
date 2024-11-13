import { v4, validate } from "uuid";

import { InvalidParameterException } from "@domain/shared/core/exceptions";
import { StringValueObject } from "@domain/shared/value-object";

class Identifier extends StringValueObject {
  constructor();
  constructor(value: string);
  constructor(value?: string) {
    if (value) Identifier.validate(value);

    super(value ?? v4());
  }

  public static validate(value: string): boolean {
    if (!validate(value))
      throw new InvalidParameterException(
        `"${this.name}" does not allow the value "${value}"`
      );

    return true;
  }
}

export { Identifier };

import { InvalidParameterException } from "@domain/shared/core/exceptions";
import { Result } from "@domain/shared/core/logic";
import { EnumValueObject } from "@domain/shared/value-object/enum-value-object";

export enum UserGenders {
  UNDEFINED = "UNDEFINED",
  MALE = "MALE",
  FEMALE = "FEMALE",
}

export class UserGender extends EnumValueObject<UserGenders> {
  constructor(value: UserGenders) {
    super(value, Object.values(UserGenders));
  }

  public static fromValue(value: string): Result<UserGender> {
    switch (value) {
      case UserGenders.UNDEFINED: {
        return Result.ok<UserGender>(new UserGender(UserGenders.UNDEFINED));
      }
      case UserGenders.MALE: {
        return Result.ok<UserGender>(new UserGender(UserGenders.MALE));
      }
      case UserGenders.FEMALE: {
        return Result.ok<UserGender>(new UserGender(UserGenders.FEMALE));
      }
      default: {
        return Result.fail<UserGender>(`The gender ${value} is invalid`);
      }
    }
  }

  protected throwErrorForInvalidValue(value: UserGenders): void {
    throw new InvalidParameterException(`The gender ${value} is invalid`);
  }
}

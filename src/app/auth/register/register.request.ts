import { UseCaseRequest } from "@app/shared";

import { UserGenders } from "@domain/user/user-gender";
import { InvalidParameterException } from "@domain/shared/core/exceptions";
import { Guard } from "@domain/shared/core/logic";
import { TriggeredBy } from "@domain/triggered-by";

export interface RegisterUserDTO {
  name: string;
  email: string;
  password: string;
  birthDate: Date;
  gender: string;
  phone: string;
  country: string;
  photo?: string;
}

export class RegisterUserRequest
  extends UseCaseRequest
  implements RegisterUserDTO
{
  constructor(
    triggeredBy: TriggeredBy,
    public readonly name: string,
    public readonly email: string,
    public readonly password: string,
    public readonly birthDate: Date,
    public readonly gender: string,
    public readonly phone: string,
    public readonly country: string,
    public readonly photo?: string
  ) {
    super(triggeredBy);
  }

  public static create(
    triggeredBy: TriggeredBy,
    dto: RegisterUserDTO
  ): RegisterUserRequest {
    return new RegisterUserRequest(
      triggeredBy,
      dto.name,
      dto.email,
      dto.password,
      dto.birthDate,
      dto.gender,
      dto.phone,
      dto.country,
      dto.photo
    );
  }

  protected validateImpl(): void {
    const result = Guard.againstNullOrUndefinedBulk([
      { value: this.name, valueName: "name" },
      { value: this.email, valueName: "email" },
      { value: this.password, valueName: "password" },
      { value: this.birthDate, valueName: "birthdate" },
      { value: this.gender, valueName: "gender" },
      { value: this.phone, valueName: "phone" },
      { value: this.country, valueName: "country" },
    ]);

    if (result.failure) {
      throw new InvalidParameterException(result.getErrorMessage());
    }

    const genderResult = Guard.isOneOf(
      this.gender,
      Object.values(UserGenders),
      "gender"
    );

    if (genderResult.failure) {
      throw new InvalidParameterException(genderResult.getErrorMessage());
    }
  }
}

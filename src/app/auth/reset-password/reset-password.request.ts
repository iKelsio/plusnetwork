import { UseCaseRequest } from "@app/shared";

import { InvalidParameterException } from "@domain/shared/core/exceptions";
import { Guard } from "@domain/shared/core/logic";
import { TriggeredBy } from "@domain/triggered-by";

export interface ResetPasswordUserDTO {
  token: string;
  password: string;
}

export class ResetPasswordUserRequest
  extends UseCaseRequest
  implements ResetPasswordUserDTO
{
  constructor(
    triggeredBy: TriggeredBy,
    public readonly token: string,
    public readonly password: string
  ) {
    super(triggeredBy);
  }

  public static create(
    triggeredBy: TriggeredBy,
    dto: ResetPasswordUserDTO
  ): ResetPasswordUserRequest {
    return new ResetPasswordUserRequest(triggeredBy, dto.token, dto.password);
  }

  protected validateImpl(): void {
    const result = Guard.againstNullOrUndefinedBulk([
      { value: this.token, valueName: "token" },
      { value: this.password, valueName: "password" },
    ]);

    if (result.failure) {
      throw new InvalidParameterException(result.getErrorMessage());
    }
  }
}

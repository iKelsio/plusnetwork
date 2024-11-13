import { UseCaseRequest } from "@app/shared";

import { InvalidParameterException } from "@domain/shared/core/exceptions";
import { Guard } from "@domain/shared/core/logic";
import { TriggeredBy } from "@domain/triggered-by";

export interface ForgotPasswordDTO {
  email: string;
}

export class ForgotPasswordRequest
  extends UseCaseRequest
  implements ForgotPasswordDTO
{
  constructor(
    triggeredBy: TriggeredBy,
    public readonly email: string
  ) {
    super(triggeredBy);
  }

  public static create(
    triggeredBy: TriggeredBy,
    dto: ForgotPasswordDTO
  ): ForgotPasswordRequest {
    return new ForgotPasswordRequest(triggeredBy, dto.email);
  }

  protected validateImpl(): void {
    const result = Guard.againstNullOrUndefinedBulk([
      { value: this.email, valueName: "email" },
    ]);

    if (result.failure) {
      throw new InvalidParameterException(result.getErrorMessage());
    }
  }
}

import { UseCaseRequest } from "@app/shared";
import { TriggeredBy } from "@domain/triggered-by";
import { InvalidParameterException } from "@domain/shared/core/exceptions";
import { Guard } from "@domain/shared/core/logic";

interface LoginDTO {
  readonly identifier: string;
  readonly password: string;
}

class LoginRequest extends UseCaseRequest implements LoginDTO {
  constructor(
    triggeredBy: TriggeredBy,
    public readonly identifier: string,
    public readonly password: string
  ) {
    super(triggeredBy);
  }

  public static create(triggeredBy: TriggeredBy, dto: LoginDTO): LoginRequest {
    return new LoginRequest(triggeredBy, dto.identifier, dto.password);
  }

  protected validateImpl(): void {
    const result = Guard.againstNullOrUndefinedBulk([
      { value: this.identifier, valueName: "identifier" },
      { value: this.password, valueName: "password" },
    ]);

    if (result.failure)
      throw new InvalidParameterException(result.getErrorMessage());
  }
}

export { LoginDTO, LoginRequest };

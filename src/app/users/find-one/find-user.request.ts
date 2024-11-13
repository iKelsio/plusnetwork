import { UseCaseRequest } from "@app/shared";
import { InvalidParameterException } from "@domain/shared/core";
import { TriggeredBy } from "@domain/triggered-by";

interface FindOneUserDTO {
  userId: string;
}

class FindOneUserRequest extends UseCaseRequest implements FindOneUserDTO {
  constructor(
    triggeredBy: TriggeredBy,
    public readonly userId: string
  ) {
    super(triggeredBy);
  }

  public static create(
    triggeredBy: TriggeredBy,
    userId: string
  ): FindOneUserRequest {
    return new FindOneUserRequest(triggeredBy, userId);
  }

  protected validateImpl(): void {
    if (this.userId == null) {
      throw new InvalidParameterException("User id must be provided");
    }
  }
}

export { FindOneUserRequest, FindOneUserDTO };

import { UseCaseRequest } from "@app/shared";
import { TriggeredBy } from "@domain/triggered-by";

interface FindAllUsersDTO {
  // filters
}

class FindAllUsersRequest extends UseCaseRequest implements FindAllUsersDTO {
  public static create(triggeredBy: TriggeredBy): FindAllUsersRequest {
    return new FindAllUsersRequest(triggeredBy);
  }

  protected validateImpl(): void {
    // no validation needed
  }
}

export { FindAllUsersRequest };

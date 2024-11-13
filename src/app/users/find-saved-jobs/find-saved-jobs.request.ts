import { UseCaseRequest } from "@app/shared";
import { TriggeredBy } from "@domain/triggered-by";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface FindSavedJobsDTO {
  // filters
}

class FindSavedJobsRequest extends UseCaseRequest implements FindSavedJobsDTO {
  public static create(triggeredBy: TriggeredBy): FindSavedJobsRequest {
    return new FindSavedJobsRequest(triggeredBy);
  }

  protected validateImpl(): void {
    // no validation needed
  }
}

export { FindSavedJobsRequest };

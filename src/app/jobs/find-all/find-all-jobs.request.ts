import { UseCaseRequest } from "@app/shared";
import { TriggeredBy } from "@domain/triggered-by";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface FindAllJobsDTO {
  // filters
}

class FindAllJobsRequest extends UseCaseRequest implements FindAllJobsDTO {
  public static create(triggeredBy: TriggeredBy): FindAllJobsRequest {
    return new FindAllJobsRequest(triggeredBy);
  }

  protected validateImpl(): void {
    // no validation needed
  }
}

export { FindAllJobsRequest };

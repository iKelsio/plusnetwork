import { UseCaseRequest } from "@app/shared";
import { TriggeredBy } from "@domain/triggered-by";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface FindAppliedJobsDTO {}

class FindAppliedJobsRequest
  extends UseCaseRequest
  implements FindAppliedJobsDTO
{
  public static create(triggeredBy: TriggeredBy): FindAppliedJobsRequest {
    return new FindAppliedJobsRequest(triggeredBy);
  }

  protected validateImpl(): void {
    // no validation needed
  }
}

export { FindAppliedJobsRequest };

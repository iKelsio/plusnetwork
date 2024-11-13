import { UseCaseRequest } from "@app/shared";
import { InvalidParameterException } from "@domain/shared/core";
import { TriggeredBy } from "@domain/triggered-by";

interface FindOneJobDTO {
  jobId: string;
}

class FindOneJobRequest extends UseCaseRequest implements FindOneJobDTO {
  constructor(
    triggeredBy: TriggeredBy,
    public readonly jobId: string
  ) {
    super(triggeredBy);
  }

  public static create(
    triggeredBy: TriggeredBy,
    jobId: string
  ): FindOneJobRequest {
    return new FindOneJobRequest(triggeredBy, jobId);
  }

  protected validateImpl(): void {
    if (this.jobId == null) {
      throw new InvalidParameterException("Job id must be provided");
    }
  }
}

export { FindOneJobRequest, FindOneJobDTO };

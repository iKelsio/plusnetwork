import { BaseUseCase } from "@app/shared";
import {
  Either,
  DomainException,
  right,
  Identifier,
} from "@domain/shared/core";
import { FindAppliedJobsRequest } from "./find-applied-jobs.request";
import { IJobRepository, Job } from "@domain/job";

type Response = Either<DomainException, Job[]>;

class FindAppliedJobsUseCase extends BaseUseCase<
  FindAppliedJobsRequest,
  Response
> {
  constructor(private jobsRepository: IJobRepository) {
    super();
  }

  protected async executeImpl(
    payload: FindAppliedJobsRequest
  ): Promise<Response> {
    const jobs = await this.jobsRepository.findApplied(
      new Identifier(payload.triggeredBy.who)
    );

    return right(jobs);
  }
}

export { FindAppliedJobsUseCase };

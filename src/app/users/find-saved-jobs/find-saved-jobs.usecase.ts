import { BaseUseCase } from "@app/shared";
import {
  Either,
  DomainException,
  right,
  Identifier,
} from "@domain/shared/core";
import { FindSavedJobsRequest } from "./find-saved-jobs.request";
import { IJobRepository, Job } from "@domain/job";

type Response = Either<DomainException, Job[]>;

class FindSavedJobsUseCase extends BaseUseCase<FindSavedJobsRequest, Response> {
  constructor(private jobsRepository: IJobRepository) {
    super();
  }

  protected async executeImpl(
    payload: FindSavedJobsRequest
  ): Promise<Response> {
    const jobs = await this.jobsRepository.findSaved(
      new Identifier(payload.triggeredBy.who)
    );

    return right(jobs);
  }
}

export { FindSavedJobsUseCase };

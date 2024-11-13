import { BaseUseCase } from "@app/shared";
import { Either, DomainException, right } from "@domain/shared/core";
import { FindAllJobsRequest } from "./find-all-jobs.request";
import { IJobRepository, Job } from "@domain/job";

type Response = Either<DomainException, Job[]>;

class FindAllJobsUseCase extends BaseUseCase<FindAllJobsRequest, Response> {
  constructor(private jobsRepository: IJobRepository) {
    super();
  }

  protected async executeImpl(payload: FindAllJobsRequest): Promise<Response> {
    const jobs = await this.jobsRepository.findAll();
    return right(jobs);
  }
}

export { FindAllJobsUseCase };

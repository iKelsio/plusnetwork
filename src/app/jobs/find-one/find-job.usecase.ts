import { BaseUseCase } from "@app/shared";
import {
  Either,
  DomainException,
  Identifier,
  right,
} from "@domain/shared/core";
import { UserNotExistsException } from "@domain/user/exceptions";
import { FindOneJobRequest } from "./find-job.request";
import { IJobRepository, Job } from "@domain/job";

type Response = Either<DomainException, Job>;

class FindOneJobUseCase extends BaseUseCase<FindOneJobRequest, Response> {
  constructor(private jobsRepository: IJobRepository) {
    super();
  }

  public async executeImpl(request: FindOneJobRequest): Promise<Response> {
    const job = await this.jobsRepository.findById(
      new Identifier(request.jobId)
    );

    if (!job) throw new UserNotExistsException(request.jobId);

    return right(job);
  }
}

export { FindOneJobUseCase };

import { BaseUseCase } from "@app/shared";
import {
  Either,
  DomainException,
  right,
  Identifier,
} from "@domain/shared/core";
import { IUserRepository } from "@domain/user";
import { ApplyForJobUserRequest } from "./apply-for-job.request";
import {
  IJobApplicationRepository,
  JobApplication,
} from "@domain/job-application";
import { EmailTemplate, IEmailProvider } from "@domain/shared/ports";
import { IJobRepository } from "@domain/job/job.repository";

type Response = Either<DomainException, JobApplication>;

export class ApplyForJobUserUseCase extends BaseUseCase<
  ApplyForJobUserRequest,
  Response
> {
  constructor(
    private jobApplicationRepo: IJobApplicationRepository,
    private userRepository: IUserRepository,
    private jobRepository: IJobRepository,
    private emailProvider: IEmailProvider
  ) {
    super();
  }

  protected async executeImpl(
    payload: ApplyForJobUserRequest
  ): Promise<Response> {
    const foundUser = await this.userRepository.findById(
      new Identifier(payload.userId)
    );
    const foundJob = await this.jobRepository.findById(
      new Identifier(payload.jobId)
    );

    if (!foundUser || !foundJob) throw new Error("Invalid User or Job");

    const jobApplicationOrError = JobApplication.create({
      user: foundUser,
      job: foundJob,
      message: payload.message,
    });

    if (jobApplicationOrError.failure)
      throw new Error(jobApplicationOrError.getErrorMessage());

    const jobApplication = jobApplicationOrError.getValue();

    await this.emailProvider.sendMail(
      foundUser.email.value,
      EmailTemplate.jobApplicationConfirmation,
      {
        user: foundUser.flat(),
        jobTitle: foundJob.title,
        companyName: foundJob.company.name,
      }
    );

    await this.jobApplicationRepo.save(jobApplication);

    return right(jobApplication);
  }
}

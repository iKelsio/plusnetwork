// adapters/mappers/prisma-job-application.mapper.ts
import { JobApplication } from "@domain/job-application";
import { JobApplication as JobApplicationModel } from "@prisma/client";
import { User } from "@domain/user";
import { Job } from "@domain/job";
import { Identifier } from "@domain/shared/core";

export class PrismaJobApplicationMapper {
  public static toDomainModel(
    jobApplicationModel: JobApplicationModel,
    user: User,
    job: Job
  ): JobApplication {
    return new JobApplication(
      user,
      job,
      jobApplicationModel.appliedAt,
      jobApplicationModel.status as "pending",
      jobApplicationModel.message ?? undefined,
      new Identifier(jobApplicationModel.id),
      jobApplicationModel.createdAt,
      undefined,
      jobApplicationModel.updatedAt,
      undefined,
      jobApplicationModel.deletedAt ?? undefined,
      undefined
    );
  }

  public static toPersistenceModel(
    jobApplication: JobApplication
  ): JobApplicationModel {
    return {
      id: jobApplication.id.value,
      jobId: jobApplication.id.value,
      appliedAt: jobApplication.appliedAt,
      message: jobApplication.message ?? null,
      status: jobApplication.status,
      userId: jobApplication.user.id.value,
      createdAt: jobApplication.createdAt,
      createdBy: jobApplication.createdBy?.who ?? null,
      updatedAt: jobApplication.updatedAt,
      updatedBy: jobApplication.updatedBy?.who ?? null,
      deletedAt: jobApplication.deletedAt ?? null,
      deletedBy: jobApplication.deletedBy?.who ?? null,
    };
  }
}

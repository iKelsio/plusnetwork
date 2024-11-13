import { Job } from "@domain/job";
import { Job as JobModel } from "@prisma/client";
import { Company } from "@domain/company";
import { Identifier } from "@domain/shared/core";

export class PrismaJobMapper {
  public static toDomainModel(jobModel: JobModel, company: Company): Job {
    return new Job(
      jobModel.title,
      company,
      jobModel.description,
      jobModel.location,
      jobModel.salaryRange,
      jobModel.jobType,
      jobModel.workType,
      jobModel.skillsTags,
      new Identifier(jobModel.id),
      jobModel.createdAt,
      undefined,
      jobModel.updatedAt,
      undefined,
      jobModel.deletedAt ?? undefined,
      undefined
    );
  }

  public static toPersistenceModel(job: Job): JobModel {
    return {
      id: job.id.value,
      title: job.title,
      description: job.description,
      location: job.location,
      salaryRange: job.salaryRange,
      jobType: job.jobType,
      companyId: job.company.id.value,
      workType: job.workType,
      skillsTags: job.skillsTags,
      createdAt: job.createdAt,
      createdBy: job.createdBy?.who ?? null,
      updatedAt: job.updatedAt,
      updatedBy: job.updatedBy?.who ?? null,
      deletedAt: job.deletedAt ?? null,
      deletedBy: job.deletedBy?.who ?? null,
    };
  }
}

import { PrismaClient } from "@prisma/client";
import { JobApplication } from "@domain/job-application";
import { IJobApplicationRepository } from "@domain/job-application/job-application.repository";
import { Identifier } from "@domain/shared/core";
import { PrismaCompanyMapper } from "../company/prisma-company.mapper";
import { PrismaJobMapper } from "../job/prisma-job.mapper";
import { PrismaJobApplicationMapper } from "./prisma-job-application.mapper";
import { PrismaUserMapper } from "../user/prisma-user.mapper";

class PrismaJobApplicationRepository implements IJobApplicationRepository {
  constructor(private jobApplication: PrismaClient["jobApplication"]) {}
  findAll(): Promise<JobApplication[]> {
    throw new Error("Method not implemented.");
  }

  async findById(id: Identifier): Promise<JobApplication | null> {
    const jobApplication = await this.jobApplication.findUnique({
      where: { id: id.value },
      include: { user: true, job: { include: { company: true } } },
    });

    if (!jobApplication) return null;

    const user = PrismaUserMapper.toDomainModel(jobApplication.user);
    const job = PrismaJobMapper.toDomainModel(
      jobApplication.job,
      PrismaCompanyMapper.toDomainModel(jobApplication.job.company)
    );

    return PrismaJobApplicationMapper.toDomainModel(jobApplication, user, job);
  }

  async save(jobApplication: JobApplication): Promise<void> {
    const jobApplicationModel =
      PrismaJobApplicationMapper.toPersistenceModel(jobApplication);
    await this.jobApplication.upsert({
      where: { id: jobApplication.id.value },
      create: jobApplicationModel,
      update: jobApplicationModel,
    });
  }
}

export { PrismaJobApplicationRepository };

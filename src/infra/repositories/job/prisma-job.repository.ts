// adapters/repositories/prisma-job.repository.ts
import { PrismaClient } from "@prisma/client";
import { Job } from "@domain/job";
import { IJobRepository } from "@domain/job/job.repository";
import { Identifier } from "@domain/shared/core";
import { PrismaCompanyMapper } from "../company/prisma-company.mapper";
import { PrismaJobMapper } from "./prisma-job.mapper";

class PrismaJobRepository implements IJobRepository {
  constructor(private job: PrismaClient["job"]) {}
  async findApplied(userId: Identifier): Promise<Job[]> {
    const appliedJobs = await this.job.findMany({
      where: { applicants: { every: { id: userId.value } } },
      include: { company: true },
    });

    return appliedJobs.map((job) =>
      PrismaJobMapper.toDomainModel(
        job,
        PrismaCompanyMapper.toDomainModel(job.company)
      )
    );
  }

  async findAll(): Promise<Job[]> {
    const jobs = await this.job.findMany({
      include: {
        company: true,
      },
    });
    return jobs.map((job) =>
      PrismaJobMapper.toDomainModel(
        job,
        PrismaCompanyMapper.toDomainModel(job.company)
      )
    );
  }

  async findById(id: Identifier): Promise<Job | null> {
    const job = await this.job.findUnique({
      where: { id: id.value },
      include: { company: true },
    });
    if (!job) return null;

    const company = PrismaCompanyMapper.toDomainModel(job.company);
    return PrismaJobMapper.toDomainModel(job, company);
  }

  async findSaved(userId: Identifier): Promise<Job[]> {
    const savedJobs = await this.job.findMany({
      where: {
        savedByUsers: {
          every: { id: userId.value },
        },
      },
      include: { company: true },
    });
    return savedJobs.map((savedJob) =>
      PrismaJobMapper.toDomainModel(
        savedJob,
        PrismaCompanyMapper.toDomainModel(savedJob.company)
      )
    );
  }

  async save(job: Job): Promise<void> {
    const jobModel = PrismaJobMapper.toPersistenceModel(job);
    await this.job.upsert({
      where: { id: job.id.value },
      create: jobModel,
      update: jobModel,
    });
  }
}

export { PrismaJobRepository };

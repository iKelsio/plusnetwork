import { IBaseRepository } from "@domain/shared/core";
import { JobApplication } from "./job-application";

export type IJobApplicationRepository = IBaseRepository<JobApplication>;

import { Job } from "@domain/job";
import { IJobFlattened } from "@domain/job/job.types";
import { IUserFlattened, User } from "@domain/user";

export interface IJobApplicationAttributes {
  user: User;
  job: Job;
  appliedAt: Date;
  status: "pending" | "rejected" | "accepted";
  message?: string;
}

export interface IJobApplicationFlattened {
  user: IUserFlattened;
  job: IJobFlattened;
  appliedAt: Date;
  status: "pending" | "rejected" | "accepted";
  message?: string;
}

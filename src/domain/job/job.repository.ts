import { IBaseRepository, Identifier } from "@domain/shared/core";
import { Job } from "./job";

export interface IJobRepository extends IBaseRepository<Job> {
  findSaved(userId: Identifier): Promise<Job[]>;
  findApplied(userId: Identifier): Promise<Job[]>;
}

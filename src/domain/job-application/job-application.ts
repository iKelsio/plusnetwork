import { Job } from "@domain/job";
import { Entity, Identifier, Result } from "@domain/shared/core";
import { TriggeredBy } from "@domain/triggered-by";
import { User } from "@domain/user";
import {
  IJobApplicationAttributes,
  IJobApplicationFlattened,
} from "./job-application.types";

export class JobApplication
  extends Entity
  implements IJobApplicationAttributes
{
  constructor(
    public user: User,
    public job: Job,
    public appliedAt: Date,
    public status: "pending" | "rejected" | "accepted",
    public message?: string,
    id?: Identifier,
    createdAt?: Date,
    createdBy?: TriggeredBy,
    updatedAt?: Date,
    updatedBy?: TriggeredBy,
    deletedAt?: Date,
    deletedBy?: TriggeredBy
  ) {
    super(id, createdAt, createdBy, updatedAt, updatedBy, deletedAt, deletedBy);
  }

  public static create(
    attributes: Omit<IJobApplicationAttributes, "status" | "appliedAt">,
    jobApplicationId?: Identifier
  ): Result<JobApplication> {
    return Result.ok(
      new JobApplication(
        attributes.user,
        attributes.job,
        new Date(),
        "pending",
        attributes.message,
        jobApplicationId
      )
    );
  }

  public flat(): IJobApplicationFlattened {
    return this.flatDomainEntity({
      user: this.user.flat(),
      job: this.job.flat(),
      appliedAt: this.appliedAt,
      status: this.status,
      message: this.message,
    });
  }
}

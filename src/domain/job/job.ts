import { Company } from "@domain/company";
import { Entity, Identifier } from "@domain/shared/core";
import { TriggeredBy } from "@domain/triggered-by";
import {
  IJobAttributes,
  IJobEditableAttributes,
  IJobFlattened,
} from "./job.types";

export class Job extends Entity implements IJobAttributes {
  constructor(
    public title: string,
    public company: Company,
    public description: string,
    public location: string,
    public salaryRange: string,
    public jobType: string,
    public workType: string,
    public skillsTags: string[],
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

  public updateAttributes(
    attributes: IJobEditableAttributes,
    updatedBy: TriggeredBy
  ): void {
    if (attributes.title) this.title = attributes.title;
    if (attributes.location) this.location = attributes.location;
    if (attributes.description) this.description = attributes.description;
    if (attributes.jobType) this.jobType = attributes.jobType;
    if (attributes.workType) this.workType = attributes.workType;
    if (attributes.skillsTags) this.skillsTags = attributes.skillsTags;
    if (attributes.salaryRange) this.salaryRange = attributes.salaryRange;

    this.markAsUpdated(updatedBy);
  }

  public flat(): IJobFlattened {
    return this.flatDomainEntity({
      title: this.title,
      description: this.description,
      location: this.location,
      jobType: this.jobType,
      workType: this.workType,
      skillsTags: this.skillsTags,
      company: this.company.flat(),
      salaryRange: this.salaryRange,
    });
  }
}

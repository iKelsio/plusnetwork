import { Entity, Identifier } from "@domain/shared/core";
import { TriggeredBy } from "@domain/triggered-by";
import { UserEmail } from "@domain/user/user-email";
import {
  ICompanyAttributes,
  ICompanyEditableAttributes,
  ICompanyFlattened,
} from "./company.types";

export class Company extends Entity implements ICompanyAttributes {
  constructor(
    public name: string,
    public people: string,
    public location: string,
    public description: string,
    public contact: string,
    public supportEmail: UserEmail,
    public industryType: string,
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
    attributes: ICompanyEditableAttributes,
    updatedBy: TriggeredBy
  ): void {
    if (attributes.name) this.name = attributes.name;
    if (attributes.people) this.people = attributes.people;
    if (attributes.location) this.location = attributes.location;
    if (attributes.description) this.description = attributes.description;
    if (attributes.contact) this.contact = attributes.contact;
    if (attributes.supportEmail) this.supportEmail = attributes.supportEmail;
    if (attributes.industryType) this.industryType = attributes.industryType;

    this.markAsUpdated(updatedBy);
  }

  public flat(): ICompanyFlattened {
    return this.flatDomainEntity({
      name: this.name,
      people: this.people,
      location: this.location,
      description: this.description,
      contact: this.contact,
      supportEmail: this.supportEmail.value,
      industryType: this.industryType,
    });
  }
}

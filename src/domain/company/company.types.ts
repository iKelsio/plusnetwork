import { EntityFlattened } from "@domain/shared/core";
import { UserEmail } from "@domain/user/user-email";

export interface ICompanyAttributes {
  name: string;
  people: string;
  location: string;
  description: string;
  contact: string;
  supportEmail: UserEmail;
  industryType: string;
}

export type ICompanyEditableAttributes = Partial<Omit<ICompanyAttributes, "">>;

export type ICompanyFlattened = EntityFlattened<{
  name: string;
  people: string;
  location: string;
  description: string;
  contact: string;
  supportEmail: string;
  industryType: string;
}>;

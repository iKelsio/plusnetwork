import { Company, ICompanyFlattened } from "@domain/company";
import { EntityFlattened } from "@domain/shared/core";

export interface IJobAttributes {
  title: string;
  company: Company;
  description: string;
  location: string;
  salaryRange: string;
  jobType: string;
  workType: string;
  skillsTags: string[];
}

export type IJobEditableAttributes = Partial<Omit<IJobAttributes, "company">>;

export type IJobFlattened = EntityFlattened<{
  title: string;
  company: ICompanyFlattened;
  description: string;
  location: string;
  salaryRange: string;
  jobType: string;
  workType: string;
  skillsTags: string[];
}>;

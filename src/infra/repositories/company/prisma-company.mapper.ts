import { Company } from "@domain/company";
import { Company as CompanyModel } from "@prisma/client";
import { UserEmail } from "@domain/user/user-email";
import { Identifier } from "@domain/shared/core";

export class PrismaCompanyMapper {
  public static toDomainModel(companyModel: CompanyModel): Company {
    return new Company(
      companyModel.name,
      companyModel.people,
      companyModel.location,
      companyModel.description,
      companyModel.contact,
      UserEmail.create(companyModel.supportEmail).getValue(),
      companyModel.industryType,
      new Identifier(companyModel.id),
      companyModel.createdAt,
      undefined,
      companyModel.updatedAt,
      undefined,
      companyModel.deletedAt ?? undefined,
      undefined
    );
  }

  public static toPersistenceModel(company: Company): CompanyModel {
    return {
      id: company.id.value,
      name: company.name,
      people: company.people,
      location: company.location,
      description: company.description,
      contact: company.contact,
      supportEmail: company.supportEmail.value,
      industryType: company.industryType,
      createdAt: company.createdAt,
      createdBy: company.createdBy?.who ?? null,
      updatedAt: company.updatedAt,
      updatedBy: company.updatedBy?.who ?? null,
      deletedAt: company.deletedAt ?? null,
      deletedBy: company.deletedBy?.who ?? null,
    };
  }
}

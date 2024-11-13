import { PrismaClient } from "@prisma/client";
import { Company } from "@domain/company";
import { ICompanyRepository } from "@domain/company/company.repository";

import { Identifier } from "@domain/shared/core";
import { PrismaCompanyMapper } from "./prisma-company.mapper";

export class PrismaCompanyRepository implements ICompanyRepository {
  constructor(private company: PrismaClient["company"]) {}

  async findById(id: Identifier): Promise<Company | null> {
    const company = await this.company.findUnique({
      where: { id: id.value },
    });
    return company ? PrismaCompanyMapper.toDomainModel(company) : null;
  }

  async findAll(): Promise<Company[]> {
    const companies = await this.company.findMany({});

    return companies.map(PrismaCompanyMapper.toDomainModel);
  }

  async save(company: Company): Promise<void> {
    const companyModel = PrismaCompanyMapper.toPersistenceModel(company);
    await this.company.upsert({
      where: { id: company.id.value },
      create: companyModel,
      update: companyModel,
    });
  }
}

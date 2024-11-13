import { BaseUseCase } from "@app/shared";
import { Either, DomainException, right } from "@domain/shared/core";
import { FindAllCompaniesRequest } from "./find-all-companies.request";
import { Company, ICompanyRepository } from "@domain/company";

type Response = Either<DomainException, Company[]>;

class FindAllCompaniesUseCase extends BaseUseCase<
  FindAllCompaniesRequest,
  Response
> {
  constructor(private companiesRepository: ICompanyRepository) {
    super();
  }

  protected async executeImpl(
    payload: FindAllCompaniesRequest
  ): Promise<Response> {
    const companies = await this.companiesRepository.findAll();
    return right(companies);
  }
}

export { FindAllCompaniesUseCase };

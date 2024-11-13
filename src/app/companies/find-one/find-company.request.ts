import { UseCaseRequest } from "@app/shared";
import { InvalidParameterException } from "@domain/shared/core";
import { TriggeredBy } from "@domain/triggered-by";

interface FindOneCompanyDTO {
  companyId: string;
}

class FindOneCompanyRequest
  extends UseCaseRequest
  implements FindOneCompanyDTO
{
  constructor(
    triggeredBy: TriggeredBy,
    public readonly companyId: string
  ) {
    super(triggeredBy);
  }

  public static create(
    triggeredBy: TriggeredBy,
    companyId: string
  ): FindOneCompanyRequest {
    return new FindOneCompanyRequest(triggeredBy, companyId);
  }

  protected validateImpl(): void {
    if (this.companyId == null) {
      throw new InvalidParameterException("Company id must be provided");
    }
  }
}

export { FindOneCompanyRequest, FindOneCompanyDTO };

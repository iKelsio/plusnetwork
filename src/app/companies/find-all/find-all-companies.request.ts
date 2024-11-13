import { UseCaseRequest } from "@app/shared";
import { TriggeredBy } from "@domain/triggered-by";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface FindAllCompaniesDTO {
  // filters
}

class FindAllCompaniesRequest
  extends UseCaseRequest
  implements FindAllCompaniesDTO
{
  public static create(triggeredBy: TriggeredBy): FindAllCompaniesRequest {
    return new FindAllCompaniesRequest(triggeredBy);
  }

  protected validateImpl(): void {
    // no validation needed
  }
}

export { FindAllCompaniesRequest };

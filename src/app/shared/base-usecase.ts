import { DomainException } from "@domain/shared/core/exceptions";
import { Either, left } from "@domain/shared/core/logic";

import { UseCaseRequest } from "./usecase.request";

type UseCaseResponse = Either<DomainException, NonNullable<unknown> | void>;
/**
 * error {
 *  name
 *  code
 *  type
 *  message
 * }
 */
abstract class BaseUseCase<
  IRequest extends UseCaseRequest,
  IResponse extends UseCaseResponse,
> {
  public async execute(request: IRequest): Promise<IResponse> {
    try {
      request.validate();

      // TODO: Throw a validation error

      return await this.executeImpl(request);
    } catch (error) {
      return left(
        error instanceof DomainException ? error : new Error(error.message)
      ) as IResponse;
    }
  }

  protected abstract executeImpl(request: IRequest): Promise<IResponse>;
}

export { BaseUseCase };

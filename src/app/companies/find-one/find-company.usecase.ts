import { BaseUseCase } from "@app/shared";
import {
  Either,
  DomainException,
  Identifier,
  right,
} from "@domain/shared/core";
import { User } from "@domain/user";
import { UserNotExistsException } from "@domain/user/exceptions";
import { IUserRepository } from "@domain/user/user.repository";
import { FindOneUserRequest } from "./find-company.request";

type Response = Either<DomainException, User>;

class FindOneUserUseCase extends BaseUseCase<FindOneUserRequest, Response> {
  constructor(private userRepository: IUserRepository) {
    super();
  }

  public async executeImpl(request: FindOneUserRequest): Promise<Response> {
    const user = await this.userRepository.findById(
      new Identifier(request.companyId)
    );

    if (!user) throw new UserNotExistsException(request.companyId);

    return right(user);
  }
}

export { FindOneUserUseCase };

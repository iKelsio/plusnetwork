import { BaseUseCase } from "@app/shared";
import { Either, DomainException, right } from "@domain/shared/core";
import { User } from "@domain/user";
import { IUserRepository } from "@domain/user/user.repository";
import { FindAllUsersRequest } from "./find-all-users.request";

type Response = Either<DomainException, User[]>;

class FindAllUsersUseCase extends BaseUseCase<FindAllUsersRequest, Response> {
  constructor(private userRepository: IUserRepository) {
    super();
  }

  protected async executeImpl(payload: FindAllUsersRequest): Promise<Response> {
    const users = await this.userRepository.findAll();
    return right(users);
  }
}

export { FindAllUsersUseCase };

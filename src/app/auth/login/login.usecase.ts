import { BaseUseCase } from "@app/shared";
import { Either, right } from "@domain/shared/core";
import { UserEmail } from "@domain/user/user-email";
import { LoginRequest } from "./login.request";
import { InvalidCredentialsException } from "@domain/user/exceptions";
import { IUserRepository } from "@domain/user/user.repository";
import { User } from "@domain/user";

type LoginUseCaseResponse = Either<InvalidCredentialsException, User>;

class LoginUseCase extends BaseUseCase<LoginRequest, LoginUseCaseResponse> {
  constructor(private userRepository: IUserRepository) {
    super();
  }

  protected async executeImpl(
    credentials: LoginRequest
  ): Promise<LoginUseCaseResponse> {
    const identifier = {
      email: UserEmail.create(credentials.identifier).getValue(),
    };

    const user = await this.userRepository.findUnique(identifier);

    if (!user) throw new InvalidCredentialsException(credentials.identifier);

    const match = await user.passwordMatches(credentials.password);

    if (!match) throw new InvalidCredentialsException(credentials.password);

    return right(user);
  }
}

export { LoginUseCase };

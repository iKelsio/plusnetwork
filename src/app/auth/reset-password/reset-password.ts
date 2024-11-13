import { BaseUseCase } from "@app/shared";
import {
  DomainException,
  Either,
  Identifier,
  InvalidParameterException,
  right,
} from "@domain/shared/core";
import { IUserRepository } from "@domain/user/user.repository";
import { ResetPasswordUserRequest } from "./reset-password.request";
import { UserPasswordHash } from "@domain/user/user-password";
import {
  EmailTemplate,
  IEmailProvider,
  ITokenProvider,
} from "@domain/shared/ports";

type Response = Either<DomainException, boolean>;

class ResetPasswordUserUseCase extends BaseUseCase<
  ResetPasswordUserRequest,
  Response
> {
  constructor(
    private userRepo: IUserRepository,
    private tokenProvider: ITokenProvider<{ userId: string }>,
    private emailProvider: IEmailProvider
  ) {
    super();
  }

  protected async executeImpl(
    payload: ResetPasswordUserRequest
  ): Promise<Response> {
    const { userId } = this.tokenProvider.verifyToken(payload.token);

    const foundUser = await this.userRepo.findById(new Identifier(userId));

    if (!foundUser) return right(false);

    const passwordOrError = await UserPasswordHash.fromPlainPassword(
      payload.password
    );

    if (passwordOrError.failure)
      throw new InvalidParameterException(passwordOrError.getErrorMessage());

    foundUser.resetPassword(passwordOrError.getValue(), payload.triggeredBy);

    await this.emailProvider.sendMail(
      foundUser.email.value,
      EmailTemplate.passwordChanged,
      {}
    );

    return right(true);
  }
}

export { ResetPasswordUserUseCase };

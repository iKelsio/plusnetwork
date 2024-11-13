import { BaseUseCase } from "@app/shared";
import {
  DomainException,
  Either,
  InvalidParameterException,
  right,
} from "@domain/shared/core";
import { IUserRepository } from "@domain/user/user.repository";
import { ResetPasswordUserRequest } from "./reset-password.request";
import { UserPasswordHash } from "@domain/user/user-password";
import { EmailTemplate, IEmailProvider } from "@domain/shared/ports";
import { DateTime } from "luxon";

type Response = Either<DomainException, boolean>;

class ResetPasswordUserUseCase extends BaseUseCase<
  ResetPasswordUserRequest,
  Response
> {
  constructor(
    private userRepo: IUserRepository,
    private emailProvider: IEmailProvider
  ) {
    super();
  }

  protected async executeImpl(
    payload: ResetPasswordUserRequest
  ): Promise<Response> {
    const foundUser = await this.userRepo.findByToken(payload.token);
    if (!foundUser) return right(false);

    if (
      DateTime.fromJSDate(foundUser.resetTokenExpiration!)
        .diffNow()
        .toMillis() < 0
    )
      throw new Error("Invalid Token! Try Again");

    const passwordOrError = await UserPasswordHash.fromPlainPassword(
      payload.password
    );

    if (passwordOrError.failure)
      throw new InvalidParameterException(passwordOrError.getErrorMessage());

    foundUser.resetPassword(passwordOrError.getValue(), payload.triggeredBy);

    await this.emailProvider.sendMail(
      foundUser.email.value,
      EmailTemplate.passwordChanged,
      { user: foundUser.flat() }
    );

    this.userRepo.save(foundUser);

    return right(true);
  }
}

export { ResetPasswordUserUseCase };

import { BaseUseCase } from "@app/shared";
import { DomainException, Either, right } from "@domain/shared/core";
import { UserEmail } from "@domain/user/user-email";
import { IUserRepository } from "@domain/user/user.repository";
import { ForgotPasswordRequest } from "./forgot-password.request";
import {
  EmailTemplate,
  IEmailProvider,
  ITokenProvider,
} from "@domain/shared/ports";
import { DateTime } from "luxon";

type Response = Either<DomainException, string>;

export class ForgotPasswordUseCase extends BaseUseCase<
  ForgotPasswordRequest,
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
    payload: ForgotPasswordRequest
  ): Promise<Response> {
    const emailOrError = UserEmail.create(payload.email);
    if (emailOrError.failure) throw emailOrError.getErrorMessage();
    const foundUser = await this.userRepo.findUnique({
      email: emailOrError.getValue(),
    });

    if (!foundUser) return right("Verify your email");

    const token: string = this.tokenProvider.generateToken(
      { userId: foundUser.id.value },
      DateTime.now().plus({ minutes: 30 }).toJSDate()
    );

    foundUser.setResetToken(token, payload.triggeredBy);

    this.emailProvider.sendMail(
      foundUser.id.value,
      EmailTemplate.forgotPassword,
      {}
    );

    this.userRepo.save(foundUser);

    return right("Verify your email");
  }
}

import { BaseUseCase } from "@app/shared";
import { DomainException, Either, right } from "@domain/shared/core";
import { UserEmail } from "@domain/user/user-email";
import { IUserRepository } from "@domain/user/user.repository";
import { ForgotPasswordRequest } from "./forgot-password.request";
import { EmailTemplate, IEmailProvider } from "@domain/shared/ports";
import { DateTime } from "luxon";
import * as crypto from "crypto";

type Response = Either<DomainException, string>;

export class ForgotPasswordUseCase extends BaseUseCase<
  ForgotPasswordRequest,
  Response
> {
  constructor(
    private userRepo: IUserRepository,
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

    if (!foundUser) return right("Check your email inbox");

    const token = crypto.randomBytes(32).toString("hex");
    const expiration = DateTime.now().plus({ minutes: 30 }).toJSDate();
    console.log({
      expiration,
      now: DateTime.now().toJSDate(),
      diff: DateTime.fromJSDate(expiration).diffNow().toMillis(),
    });
    foundUser.setResetToken(token, expiration, payload.triggeredBy);

    this.emailProvider.sendMail(
      foundUser.email.value,
      EmailTemplate.forgotPassword,
      {
        user: foundUser.flat(),
        resetLink: `http://localhost:5500/api/v1/reset-password/${token}`,
      }
    );

    this.userRepo.save(foundUser);

    return right("Check your email inbox");
  }
}

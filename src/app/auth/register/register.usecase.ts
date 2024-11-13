import { BaseUseCase } from "@app/shared";
import {
  DomainException,
  Either,
  Guard,
  InvalidParameterException,
  Result,
  right,
} from "@domain/shared/core";
import { User } from "@domain/user";
import { UserEmail } from "@domain/user/user-email";
import { UserGender } from "@domain/user/user-gender";
import { UserPasswordHash } from "@domain/user/user-password";
import { IUserRepository } from "@domain/user/user.repository";
import { RegisterUserRequest } from "./register.request";
import { IEmailProvider } from "@domain/shared/ports";

type Response = Either<DomainException, User>;

export class RegisterUserUseCase extends BaseUseCase<
  RegisterUserRequest,
  Response
> {
  constructor(
    private userRepo: IUserRepository,
    private emailProvider: IEmailProvider
  ) {
    super();
  }

  protected async executeImpl(payload: RegisterUserRequest): Promise<Response> {
    const emailOrError = UserEmail.create(payload.email);
    const passwordOrError = await UserPasswordHash.fromPlainPassword(
      payload.password
    );
    const genderOrError = UserGender.fromValue(payload.gender);

    const payloadResult = Result.combine<unknown>([
      emailOrError,
      passwordOrError,
      genderOrError,
      Guard.againstNullOrUndefinedBulk([
        { value: payload.name, valueName: "name" },
        { value: payload.birthDate, valueName: "birthDate" },
        { value: payload.country, valueName: "location" },
        { value: payload.phone, valueName: "phone" },
      ]),
    ]);
    if (payloadResult.failure)
      throw new InvalidParameterException(payloadResult.getErrorMessage());

    const email = emailOrError.getValue();
    const passwordHash = passwordOrError.getValue();
    const gender = genderOrError.getValue();

    const foundUser = await this.userRepo.findUnique({
      email,
    });

    if (foundUser) throw new Error("User Already exists");

    const userOrError = User.create({
      name: payload.name,
      birthDate: payload.birthDate,
      email,
      passwordHash,
      gender,
      country: payload.country,
      phone: payload.phone,
      verified: false,
      photo: payload.photo ?? null,
    });

    if (userOrError.failure) throw new Error(userOrError.getErrorMessage());

    const user = userOrError.getValue();

    await this.userRepo.save(user);

    this.emailProvider.sendMail(user.email.value, "welcome", {
      user: user.flat(),
    });

    return right(user);
  }
}

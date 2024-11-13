import {
  Entity,
  Guard,
  Identifier,
  InvalidParameterException,
  Result,
} from "@domain/shared/core";
import { TriggeredBy, TriggeredBySystem } from "@domain/triggered-by";
import { UserEmail } from "./user-email";
import { UserGender } from "./user-gender";
import { UserPasswordHash } from "./user-password";
import {
  IUserAttributes,
  IUserEditableAttributes,
  IUserFlattened,
} from "./user.types";
import { Job } from "@domain/job";

export class User extends Entity implements IUserAttributes {
  constructor(
    public name: string,
    public email: UserEmail,
    public passwordHash: UserPasswordHash,
    public gender: UserGender,
    public phone: string,
    public birthDate: Date,
    public photo: string | null = null,
    public country: string,
    public verified: boolean = false,
    public resetToken: string | null = null,
    public resetTokenExpiration: Date | null = null,
    private savedJobs: Job[] = [],
    id?: Identifier,
    createdAt?: Date,
    createdBy?: TriggeredBy,
    updatedAt?: Date,
    updatedBy?: TriggeredBy,
    deletedAt?: Date,
    deletedBy?: TriggeredBy
  ) {
    super(id, createdAt, createdBy, updatedAt, updatedBy, deletedAt, deletedBy);
  }

  public static create(
    attributes: IUserAttributes,
    userId?: Identifier
  ): Result<User> {
    const guardResult = Guard.againstNullOrUndefinedBulk([
      { value: attributes.name, valueName: "name" },
      { value: attributes.email, valueName: "email" },
      { value: attributes.passwordHash, valueName: "passwordHash" },
      { value: attributes.birthDate, valueName: "birthdate" },
      { value: attributes.country, valueName: "country" },
      { value: attributes.phone, valueName: "phone" },
      { value: attributes.gender.value, valueName: "gender" },
    ]);

    if (guardResult.failure) {
      return Result.fail<User>(guardResult.getErrorMessage());
    }

    const createdUser = new User(
      attributes.name,
      attributes.email,
      attributes.passwordHash,
      attributes.gender,
      attributes.phone,
      attributes.birthDate,
      attributes.photo ?? null,
      attributes.country,
      false,
      null,
      null,
      [],
      userId
    );

    // TODO: In future trigger a creation domain event

    return Result.ok<User>(createdUser);
  }

  public markAsVerified(): void {
    if (this.verified) throw new Error("User already verified");

    this.verified = true;
    this.markAsUpdated(new TriggeredBySystem());
  }

  public resetPassword(
    newPassword: UserPasswordHash,
    updatedBy: TriggeredBy
  ): void {
    if (this.passwordHash.value === newPassword.value)
      throw new InvalidParameterException(
        "Password must be different in order to get updated"
      );

    this.passwordHash = newPassword;
    this.resetToken = null;
    this.resetTokenExpiration = null;
    this.markAsUpdated(updatedBy);
  }

  public setResetToken(
    token: string,
    expiration: Date,
    updatedBy: TriggeredBy
  ) {
    this.resetToken = token;
    this.resetTokenExpiration = expiration;
    this.markAsUpdated(updatedBy);
  }

  public updateAttributes(
    attributes: IUserEditableAttributes,
    updatedBy: TriggeredBy
  ): void {
    if (attributes.name) this.name = attributes.name;
    if (attributes.email) {
      this.email = attributes.email;
      this.verified = false;
    }
    if (attributes.gender) this.gender = attributes.gender;
    if (attributes.country) this.country = attributes.country;
    if (attributes.birthDate) this.birthDate = attributes.birthDate;
    if (attributes.phone) this.phone = attributes.phone;
    if (attributes.photo) this.photo = attributes.photo;

    this.markAsUpdated(updatedBy);
  }

  public flat(): IUserFlattened {
    return this.flatDomainEntity({
      name: this.name,
      email: this.email.value,
      passwordHash: this.passwordHash.value,
      birthDate: this.birthDate,
      country: this.country,
      phone: this.phone,
      gender: this.gender.value,
      photo: this.photo,
      verified: this.verified,
    });
  }

  public async passwordMatches(plainUserPassword: string): Promise<boolean> {
    return this.passwordHash.checkIfMatchesWithPlainPassword(plainUserPassword);
  }
}

import { Guard, Result } from '@domain/shared/core/logic';
import { Hash } from '@domain/shared/core';

class UserPasswordHash extends Hash {
  public static constraints = {
    minLength: 8
  };

  public static async fromPlainPassword(password: string): Promise<Result<UserPasswordHash>> {
    const passwordOrError = this.validatePassword(password);
    if (passwordOrError.failure) return passwordOrError;

    const hashedPassword = await this.fromPlainText(password);

    return UserPasswordHash.create(hashedPassword);
  }

  public static create(hash: string): Result<UserPasswordHash> {
    const result = Guard.againstNullOrUndefined(hash, 'password hash');
    if (result.failure) return Result.fail<UserPasswordHash>(result.getErrorMessage());
    return Result.ok<UserPasswordHash>(new UserPasswordHash(hash));
  }

  public async checkIfMatchesWithPlainPassword(password: string): Promise<boolean> {
    return this.comparePlainTextWithEncrypted(password, this.value);
  }

  private static validatePassword(password: string): Result<UserPasswordHash> {
    const { minLength } = UserPasswordHash.constraints;
    if (password.length < minLength) return Result.fail('password must be at least 8 chars long');

    return Result.ok();
  }
}

export { UserPasswordHash };

import { Guard, Result } from '@domain/shared/core/logic';
import { StringValueObject } from '@domain/shared/value-object';

class UserEmail extends StringValueObject {
  public static constraints = {
    maxLength: 120
  };

  public static create(email: string): Result<UserEmail> {
    const result = Guard.againstNullOrUndefined(email, 'email');
    if (result.failure) return Result.fail<UserEmail>(result.getErrorMessage());

    return Result.ok<UserEmail>(new UserEmail(email.toLowerCase()));
  }
}

export { UserEmail };

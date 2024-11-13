import { DomainException } from "@domain/shared/core/exceptions";

class UserNotExistsException extends DomainException {
  constructor(userId: string) {
    super("USER_DO_NOT_EXIST", `User with id <${userId}> does not exists`);
  }
}

export { UserNotExistsException };

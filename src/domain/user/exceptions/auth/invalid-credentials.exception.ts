import { DomainException } from "@domain/shared/core/exceptions";

class InvalidCredentialsException extends DomainException {
  constructor(identifier: string) {
    super(
      "INVALID_CREDENTIALS",
      `The credentials for user "${identifier}" are invalid`
    );
  }
}

export { InvalidCredentialsException };

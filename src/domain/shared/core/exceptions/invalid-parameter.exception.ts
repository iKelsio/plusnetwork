import { DomainException } from './domain.exception';

class InvalidParameterException extends DomainException {
  constructor(message: string) {
    super('INVALID_PARAMETER', message);
  }
}

export { InvalidParameterException };

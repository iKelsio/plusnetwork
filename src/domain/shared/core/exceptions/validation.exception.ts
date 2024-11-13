import { DomainException } from './domain.exception';

class ValidationException extends DomainException {
  constructor(message: string) {
    super('VALIDATION_ERROR', message);
  }
}

export { ValidationException };

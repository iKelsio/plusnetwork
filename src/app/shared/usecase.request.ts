import { deepEqual } from 'fast-equals';

import { TriggeredBy } from '@domain/triggered-by';
import { InvalidParameterException } from '@domain/shared/core/exceptions';
import { Guard } from '@domain/shared/core/logic';

abstract class UseCaseRequest {
  readonly triggeredBy: TriggeredBy;

  protected constructor(triggeredBy: TriggeredBy) {
    this.triggeredBy = triggeredBy;
  }

  public validate(): void {
    if (Guard.againstNullOrUndefined(this.triggeredBy).failure) {
      throw new InvalidParameterException('Triggered By must be provided');
    }

    this.validateImpl();
  }

  public equalsTo(other: UseCaseRequest): boolean {
    return deepEqual(this, other);
  }

  public toString(): string {
    return JSON.stringify(this);
  }
  protected abstract validateImpl(): void;
}

export { UseCaseRequest };

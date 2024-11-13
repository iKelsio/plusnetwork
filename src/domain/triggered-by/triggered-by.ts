import { InvalidParameterException } from '@domain/shared/core/exceptions/invalid-parameter.exception';
import { Guard } from '@domain/shared/core/logic';
import { TriggeredByUser } from './triggered-by-user';
import { TriggeredBySystem } from './triggered-by-system';
import { TriggeredByAnonymous } from './triggered-by-anonymous';

abstract class TriggeredBy {
  who: string;

  protected constructor(who: string) {
    if (Guard.againstNullOrUndefined(who, 'Who').failure) {
      throw new InvalidParameterException('"Who" identifier must be provided');
    }

    this.who = who;
  }

  public abstract isByAnonymous(): this is TriggeredByAnonymous;

  public abstract isBySystem(): this is TriggeredBySystem;

  public abstract isByUser(): this is TriggeredByUser;
}

export { TriggeredBy };

import { User } from "@domain/user";
import { TriggeredBy } from "./triggered-by";
import { TriggeredByAnonymous } from "./triggered-by-anonymous";
import { TriggeredBySystem } from "./triggered-by-system";

class TriggeredByUser extends TriggeredBy {
  constructor(userId: string) {
    super(userId);
  }

  public isByAnonymous(): this is TriggeredByAnonymous {
    return false;
  }

  public isBySystem(): this is TriggeredBySystem {
    return false;
  }

  public isByUser(): this is TriggeredByUser {
    return true;
  }

  public static fromUser(user: User): TriggeredByUser {
    return new TriggeredByUser(user.id.value);
  }
}

export { TriggeredByUser };

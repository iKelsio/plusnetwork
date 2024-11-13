import { TriggeredBy } from "./triggered-by";
import { TriggeredBySystem } from "./triggered-by-system";
import { TriggeredByUser } from "./triggered-by-user";

class TriggeredByAnonymous extends TriggeredBy {
	public static IDENTIFIER = "anonymous";

	constructor() {
		super(TriggeredByAnonymous.IDENTIFIER);
	}

	public isByAnonymous(): this is TriggeredByAnonymous {
		return true;
	}

	public isBySystem(): this is TriggeredBySystem {
		return false;
	}

	public isByUser(): this is TriggeredByUser {
		return true;
	}
}

export { TriggeredByAnonymous };

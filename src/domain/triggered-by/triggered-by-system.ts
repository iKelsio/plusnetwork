import { TriggeredBy } from "./triggered-by";
import { TriggeredByAnonymous } from "./triggered-by-anonymous";
import { TriggeredByUser } from "./triggered-by-user";

class TriggeredBySystem extends TriggeredBy {
	public static IDENTIFIER = "system";

	constructor() {
		super(TriggeredBySystem.IDENTIFIER);
	}

	public isByAnonymous(): this is TriggeredByAnonymous {
		return false;
	}

	public isBySystem(): this is TriggeredBySystem {
		return true;
	}

	public isByUser(): this is TriggeredByUser {
		return false;
	}
}

export { TriggeredBySystem };

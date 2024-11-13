class Result<T> {
	public failure: boolean;

	constructor(
		public success: boolean,
		private value?: T,
		private error?: string
	) {
		this.failure = !success;
		Object.freeze(this);
	}

	public static ok<U>(value?: U): Result<U> {
		return new Result<U>(true, value);
	}

	public static fail<U>(message: string, error?: U): Result<U> {
		return new Result<U>(false, error, message);
	}

	public static combine<T>(results: Result<T>[]): Result<T> {
		const failures = results.filter((result) => result.failure);

		if (failures.length > 0) return failures[0];

		return Result.ok<T>();
	}

	public getValue(): T {
		if (this.failure) {
			throw new Error(
				'Can\'t get the value of an error result. Use "errorValue" instead.'
			);
		}

		return this.value as T;
	}

	public getErrorMessage(): string {
		if (this.success) {
			throw new Error(`Can't get the message of an success result.`);
		}

		return this.error as string;
	}

	public getErrorValue(): T {
		return this.value as T;
	}
}

export { Result };

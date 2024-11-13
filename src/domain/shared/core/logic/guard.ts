import { Result } from './result';

interface GuardAttributes {
  value: unknown;
  valueName: string;
}

type GuardResponse = string;

class Guard {
  public static greaterThan(min: number, value: number): Result<GuardResponse> {
    return value > min ? Result.ok<string>() : Result.fail<string>(`"${value}" is not greater than "${min}"`);
  }

  public static againstNullOrUndefined(value: unknown, valueName = 'object'): Result<GuardResponse> {
    if (value === null || value === undefined) {
      return Result.fail<string>(`${valueName} is null or undefined`);
    }

    return Result.ok<string>();
  }

  public static againstNullOrUndefinedBulk(bulk: GuardAttributes[]): Result<GuardResponse> {
    const failures = bulk.filter(({ value: object }) => object === null || object === undefined);

    if (failures.length > 0) return Result.fail<string>(`${failures[0].valueName} is null or undefined`);

    return Result.ok<string>();
  }

  public static isOneOf<T>(value: T, validValues: T[], valueName = 'object'): Result<GuardResponse> {
    const isValid = validValues.includes(value);

    if (!isValid)
      return Result.fail<string>(
        `${valueName} isn't oneOf the correct types in ${JSON.stringify(validValues)}. Got "${value}".`
      );

    return Result.ok<string>();
  }

  public static inRange(value: number, min: number, max: number): Result<GuardResponse> {
    const isInRange = value >= min && value <= max;

    if (!isInRange) return Result.fail<string>(`${value} is not within range ${min} to ${max}.`);

    return Result.ok<string>();
  }
}

export { Guard, GuardAttributes, GuardResponse };

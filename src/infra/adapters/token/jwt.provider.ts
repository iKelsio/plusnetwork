import { JWT } from "@fastify/jwt";
import { ITokenProvider } from "@domain/shared/ports";
import { DateTime } from "luxon";

export class JwtProvider<
  T extends NonNullable<unknown> = Record<string, unknown>,
> implements ITokenProvider<T>
{
  constructor(private jwt: JWT) {}

  generateToken(claims: T, expiration: Date): string {
    return this.jwt.sign(claims, {
      expiresIn: DateTime.fromJSDate(expiration).toMillis(),
    });
  }
  verifyToken(value: string): T {
    return this.jwt.verify(value);
  }
}

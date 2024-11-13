export interface ITokenProvider<T = Record<string, unknown>> {
  generateToken(claims: T, expiration: Date): string;
  verifyToken(value: string): T;
}

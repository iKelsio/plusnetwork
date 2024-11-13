import * as bcrypt from 'bcrypt';
import { ValueObject } from '@domain/shared/value-object';

abstract class Hash extends ValueObject<string> {
  protected static async fromPlainText(plainText: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return bcrypt.hash(plainText, salt);
  }

  protected async comparePlainTextWithEncrypted(plainText: string, encrypted: string): Promise<boolean> {
    return bcrypt.compare(plainText, encrypted);
  }
}

export { Hash };

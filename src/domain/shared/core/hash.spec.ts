import { Hash } from "@domain/shared/core";
import * as bcrypt from "bcrypt";
import { vi, describe, Mock, beforeAll } from "vitest";

describe("Hash", () => {
  class HashValue extends Hash {
    public static async fromPlainTextImpl(password: string) {
      const hashed = await this.fromPlainText(password);
      return new HashValue(hashed);
    }

    public async comparePlainTextWithEncryptedImpl(
      password: string,
      encrypted: string
    ) {
      return this.comparePlainTextWithEncrypted(password, encrypted);
    }
  }

  beforeAll(() => {
    vi.mock("bcrypt", () => ({
      genSalt: vi.fn(),
      hash: vi.fn(),
      compare: vi.fn(),
    }));
  });

  describe("fromPlainText Method", (it) => {
    it("should hash the plain text using bcrypt", async ({ expect }) => {
      const plainText = "password123";
      const salt = "salt";
      const hashedText = "hashedPassword";

      (bcrypt.genSalt as Mock).mockResolvedValue(salt);
      (bcrypt.hash as Mock).mockResolvedValue(hashedText);

      const hashed = await HashValue.fromPlainTextImpl(plainText);

      expect(bcrypt.genSalt).toHaveBeenCalled();
      expect(bcrypt.hash).toHaveBeenCalledWith(plainText, salt);
      expect(hashed.value).toBe(hashedText);
    });
  });

  describe("comparePlainTextWithEncrypted Method", (it) => {
    it("should return true when plain text matches encrypted text", async ({
      expect,
    }) => {
      const plainText = "password123";
      const encrypted = "hashedPassword";

      (bcrypt.compare as Mock).mockResolvedValue(true);

      const hashed = await HashValue.fromPlainTextImpl(plainText);
      const result = await hashed.comparePlainTextWithEncryptedImpl(
        plainText,
        encrypted
      );

      expect(bcrypt.compare).toHaveBeenCalledWith(plainText, encrypted);
      expect(result).toBe(true);
    });

    it("should return false when plain text does not match encrypted text", async ({
      expect,
    }) => {
      const plainText = "password123";
      const encrypted = "hashedPassword";

      (bcrypt.compare as Mock).mockResolvedValue(false);
      const hashed = await HashValue.fromPlainTextImpl(plainText);
      const result = await hashed.comparePlainTextWithEncryptedImpl(
        plainText,
        encrypted
      );

      expect(bcrypt.compare).toHaveBeenCalledWith(plainText, encrypted);
      expect(result).toBe(false);
    });
  });
});

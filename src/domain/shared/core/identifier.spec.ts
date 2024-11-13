import { describe } from 'vitest';
import { validate as uuidValidate, v4 as uuidv4 } from 'uuid';
import { InvalidParameterException } from '@domain/shared/core/exceptions';
import { Identifier } from '@domain/shared/core';

describe('Identifier', () => {
  describe('Constructor', it => {
    it('should create a valid UUID when no value is provided', ({ expect }) => {
      const sut = new Identifier();
      expect(uuidValidate(sut.value)).toBe(true);
    });

    it('should accept a valid UUID string as value', ({ expect }) => {
      const validUUID = uuidv4();
      const identifier = new Identifier(validUUID);
      expect(identifier.value).toBe(validUUID);
    });

    it('should throw an InvalidParameterException when an invalid UUID is provided', ({ expect }) => {
      const invalidUUID = 'invalid-uuid';
      expect(() => new Identifier(invalidUUID)).toThrowError(
        new InvalidParameterException(`"Identifier" does not allow the value "${invalidUUID}"`)
      );
    });
  });

  describe('validate method', it => {
    it('should return true for a valid UUID', ({ expect }) => {
      const validUUID = uuidv4();
      expect(Identifier.validate(validUUID)).toBe(true);
    });

    it('should throw an InvalidParameterException for an invalid UUID', ({ expect }) => {
      const invalidUUID = 'invalid-uuid';
      expect(() => Identifier.validate(invalidUUID)).toThrowError(
        new InvalidParameterException(`"Identifier" does not allow the value "${invalidUUID}"`)
      );
    });
  });
});

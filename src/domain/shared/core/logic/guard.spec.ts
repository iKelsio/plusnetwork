import { beforeEach, describe } from 'vitest';

import { Guard, GuardResponse, Result } from '@domain/shared/core/logic';

describe('Guard & Result', () => {
  let result: Result<GuardResponse> | null;
  const valueName = 'TestValue';
  const anotherValueName = 'AnotherTestValue';

  beforeEach(() => {
    result = null;
  });

  describe('Combined results', it => {
    it('Knows that two successfull results combine into success', ({ expect }) => {
      result = Result.combine([Result.ok<any>(), Result.ok<any>()]);
      expect(result.success).toBe(true);
      expect(result.failure).toBe(false);
    });

    it('Knows that success and failure combine into overall failure', ({ expect }) => {
      const failureMessage = 'This one failed';
      result = Result.combine([Result.ok<any>(), Result.fail<any>(failureMessage)]);
      expect(result.success).toBe(false);
      expect(result.failure).toBe(true);
      expect(result.getErrorMessage()).toEqual(failureMessage);
    });
  });

  describe('Against null or undefined', it => {
    it('Knows that provided value result into success', ({ expect }) => {
      const someValue = Date.now();
      result = Guard.againstNullOrUndefined(someValue, valueName);
      expect(result.success).toBe(true);
      expect(() => result!.getErrorMessage()).toThrow(`Can't get the message of an success result.`);
    });

    it('Knows that null value result into failure', ({ expect }) => {
      result = Guard.againstNullOrUndefined(null, valueName);
      expect(result.success).toBe(false);
      expect(result.getErrorMessage()).toEqual(`${valueName} is null or undefined`);
    });

    it('Knows that undefined value result into failure', ({ expect }) => {
      result = Guard.againstNullOrUndefined(undefined, valueName);
      expect(result.success).toBe(false);
      expect(result.getErrorMessage()).toEqual(`${valueName} is null or undefined`);
    });

    it('Knows that empty string still result into success', ({ expect }) => {
      result = Guard.againstNullOrUndefined('', valueName);
      expect(result.success).toBe(true);
    });
  });

  describe('Against null or undefined bulk', it => {
    it('Knows that provided values result into success', ({ expect }) => {
      result = Guard.againstNullOrUndefinedBulk([
        { valueName, value: true },
        { valueName: anotherValueName, value: 12 }
      ]);
      expect(result.success).toBe(true);
    });

    it('Knows that a single null value result into failure', ({ expect }) => {
      result = Guard.againstNullOrUndefinedBulk([
        { valueName, value: null },
        { valueName: anotherValueName, value: 12 }
      ]);

      expect(result.success).toBe(false);
      expect(() => result!.getValue()).toThrow('Can\'t get the value of an error result. Use "errorValue" instead.');
      expect(result.getErrorMessage()).toEqual(`${valueName} is null or undefined`);
    });

    it('knows that a single undefined value result into failure', ({ expect }) => {
      result = Guard.againstNullOrUndefinedBulk([
        { valueName, value: undefined },
        { valueName: anotherValueName, value: 12 }
      ]);

      expect(result.success).toBe(false);
      expect(() => result!.getValue()).toThrow('Can\'t get the value of an error result. Use "errorValue" instead.');
      expect(result.getErrorMessage()).toEqual(`${valueName} is null or undefined`);
    });
  });
});

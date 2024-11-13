import { faker } from '@faker-js/faker';
import { beforeEach, describe } from 'vitest';

import { EntityFlattened, Entity, Identifier } from '@domain/shared/core';
import { TriggeredBy, TriggeredBySystem } from '@domain/triggered-by';

class TestEntity extends Entity {
  public flat(): EntityFlattened<{}> {
    return this.flatDomainEntity({});
  }
}

interface TestContext {
  identifier: Identifier;
  triggeredBy: TriggeredBy;
  sut: TestEntity;
}

describe<TestContext>('Entity', () => {
  beforeEach<TestContext>(ctx => {
    ctx.identifier = new Identifier();
    ctx.triggeredBy = new TriggeredBySystem();
    ctx.sut = new TestEntity();
  });

  describe<TestContext>('Constructor, default properties and getters', it => {
    it('Should initialize with default values', ({ sut, expect }) => {
      expect(sut.id).toBeInstanceOf(Identifier);
      expect(sut.createdAt).toBeInstanceOf(Date);
      expect(sut.createdBy).toBeInstanceOf(TriggeredBySystem);
      expect(sut.updatedAt).toBeInstanceOf(Date);
      expect(sut.updatedBy).toBeInstanceOf(TriggeredBySystem);
      expect(sut.deletedAt).toBeUndefined();
      expect(sut.deletedBy).toBeUndefined();
    });

    it('should return correct values from getters', ({ expect }) => {
      const identifier = faker.string.uuid();
      const createdAt = new Date();
      const createdBy = new TriggeredBySystem();
      const updatedAt = new Date();
      const updatedBy = new TriggeredBySystem();
      const sut = new TestEntity(new Identifier(identifier), createdAt, createdBy, updatedAt, updatedBy);

      expect(sut.id.value).toBe(identifier);
      expect(sut.createdAt).toBe(createdAt);
      expect(sut.createdBy).toBe(createdBy);
      expect(sut.updatedAt).toBe(updatedAt);
      expect(sut.updatedBy).toBe(updatedBy);
      expect(sut.deletedAt).toBeUndefined();
      expect(sut.deletedBy).toBeUndefined();
    });
  });

  describe<TestContext>('Deletion Status', it => {
    it('should return true when isDeleted is called after marking as deleted', ({ expect, sut, triggeredBy }) => {
      sut.markAsDeleted(triggeredBy);

      expect(sut.isDeleted).toBe(true);
    });

    it('should return false when isDeleted is called on a new entity', ({ expect }) => {
      const entity = new TestEntity();

      expect(entity.isDeleted).toBe(false);
    });
  });

  describe<TestContext>('markAsUpdated', it => {
    it('Should update updatedAt and updatedBy', ({ expect, sut, triggeredBy }) => {
      const previousUpdatedAt = sut.updatedAt;

      sut.markAsUpdated(triggeredBy);

      expect(sut.updatedAt).not.toBe(previousUpdatedAt);
      expect(sut.updatedBy).toBe(triggeredBy);
    });
  });

  describe<TestContext>('markAsDeleted', it => {
    it('Should mark the entity as deleted', ({ expect, sut, triggeredBy }) => {
      sut.markAsDeleted(triggeredBy);

      expect(sut.deletedAt).toBeInstanceOf(Date);
      expect(sut.deletedBy).toEqual(triggeredBy);
      expect(sut.isDeleted).toBe(true);
    });

    it('Should throw an error if already deleted', ({ expect, sut, triggeredBy }) => {
      sut.markAsDeleted(triggeredBy);

      expect(() => sut.markAsDeleted(triggeredBy)).toThrowError(
        `Entity was deleted by ${sut.deletedBy} at ${sut.deletedAt}`
      );
    });
  });

  describe('Entity Comparison', it => {
    it('should correctly compare two equal entities with equalsTo', ({ expect }) => {
      const entity1 = new TestEntity();
      const entity2 = new TestEntity(
        entity1.id,
        entity1.createdAt,
        entity1.createdBy,
        entity1.updatedAt,
        entity1.updatedBy,
        entity1.deletedAt,
        entity1.deletedBy
      );

      expect(entity1.equalsTo(entity2)).toBe(true);
    });

    it('should correctly compare two different entities with equalsTo', ({ expect }) => {
      const entity1 = new TestEntity();
      const entity2 = new TestEntity();

      expect(entity1.equalsTo(entity2)).toBe(false);
    });
  });

  describe<TestContext>('Flattening and String Conversion', it => {
    it('should correctly flatten the entity with flatDomainEntity', ({ expect }) => {
      const uuid = faker.string.uuid();
      const entity = new TestEntity(new Identifier(uuid));
      const flattened = entity.flat();

      expect(flattened).toEqual({
        id: uuid,
        createdAt: entity.createdAt,
        createdBy: entity.createdBy.who,
        updatedAt: entity.updatedAt,
        updatedBy: entity.updatedBy.who,
        deletedAt: entity.deletedAt,
        deletedBy: entity.deletedBy
      });
    });

    it('should correctly convert entity to string with toString', ({ expect }) => {
      const entity = new TestEntity(new Identifier());
      const entityString = entity.toString();

      expect(entityString).toBe(JSON.stringify(entity));
    });
  });
});

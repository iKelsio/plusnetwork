import { deepEqual } from "fast-equals";

import { TriggeredBy, TriggeredBySystem } from "@domain/triggered-by";
import { Identifier } from "./identifier";

export abstract class Entity {
  constructor(
    protected readonly $id = new Identifier(),
    protected $createdAt = new Date(),
    protected $createdBy = new TriggeredBySystem(),
    protected $updatedAt = new Date(),
    protected $updatedBy = $createdBy ?? new TriggeredBySystem(),
    protected $deletedAt?: Date,
    protected $deletedBy?: TriggeredBy
  ) {}

  public get isDeleted(): boolean {
    return !!this.$deletedAt;
  }

  public get id(): Identifier {
    return this.$id;
  }

  public get createdAt(): Date {
    return this.$createdAt;
  }

  public get createdBy(): TriggeredBy {
    return this.$createdBy;
  }

  public get updatedAt(): Date {
    return this.$updatedAt;
  }

  public get updatedBy(): TriggeredBy {
    return this.$updatedBy;
  }

  public get deletedAt(): Date | undefined {
    return this.$deletedAt;
  }

  public get deletedBy(): TriggeredBy | undefined {
    return this.$deletedBy;
  }

  public equalsTo(other: Entity): boolean {
    return deepEqual(this, other);
  }

  public toString(): string {
    return JSON.stringify(this);
  }

  public markAsUpdated(updatedBy: TriggeredBy): void {
    this.$updatedBy = updatedBy;
    this.$updatedAt = new Date();
  }

  public markAsDeleted(deletedBy: TriggeredBy): void {
    if (this.deletedAt)
      throw new Error(
        `Entity was deleted by ${this.deletedBy} at ${this.deletedAt}`
      );
    this.$deletedAt = new Date();
    this.$deletedBy = deletedBy;
    this.markAsUpdated(deletedBy);
  }

  protected flatDomainEntity<A>(flattenedAttributes: A): EntityFlattened<A> {
    return {
      id: this.$id.value,
      ...flattenedAttributes,
      createdAt: this.$createdAt,
      createdBy: this.$createdBy.who,
      updatedAt: this.$updatedAt,
      updatedBy: this.$updatedBy.who,
      deletedAt: this.$deletedAt,
      deletedBy: this.$deletedBy?.who,
    };
  }
}

export type EntityFlattened<T> = T & {
  id: string;
  createdAt: Date;
  createdBy: string;
  updatedAt: Date;
  updatedBy: string;
  deletedAt?: Date;
  deletedBy?: string;
};

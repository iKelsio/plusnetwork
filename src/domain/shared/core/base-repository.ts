import { Nullable } from "@domain/shared/types";
import { Entity } from "./entity";
import { Identifier } from "./identifier";

interface IBaseRepository<E extends Entity> {
  findById(id: Identifier): Promise<Nullable<E>>;
  findAll(): Promise<E[]>;
  // findOneBy(fields: Partial<E["attributes"]>): Promise<Nullable<E>>;
  save(entity: E): Promise<void>;
}

export { IBaseRepository };

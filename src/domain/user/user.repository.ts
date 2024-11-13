import { IBaseRepository } from "@domain/shared/core";
import { User } from "./user";
import { IUserAttributes } from "./user.types";
import { Nullable } from "@domain/shared/types";

export interface IUserRepository extends IBaseRepository<User> {
  findUnique(
    field: Partial<Pick<IUserAttributes, "email">>
  ): Promise<Nullable<User>>;
}

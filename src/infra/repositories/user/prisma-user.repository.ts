import { Identifier } from "@domain/shared/core";
import { IUserAttributes } from "@domain/user";
import { IUserRepository } from "@domain/user/user.repository";
import { PrismaClient } from "@prisma/client";
import { User } from "@domain/user";

import { PrismaUserMapper } from "./prisma-user.mapper";
import { Nullable } from "@domain/shared/types";

class PrismaUserRepository implements IUserRepository {
  constructor(private usersRepository: PrismaClient["user"]) {}

  public async findAll(): Promise<User[]> {
    const users = await this.usersRepository.findMany({
      where: { deletedAt: null },
    });

    return users.map(PrismaUserMapper.toDomainModel);
  }

  public async findUnique(
    field: Pick<IUserAttributes, "email">
  ): Promise<Nullable<User>> {
    const user = await this.usersRepository.findUnique({
      where: {
        email: field.email?.value,
      },
    });

    if (!user) return null;

    return PrismaUserMapper.toDomainModel(user);
  }

  public async findById(userId: Identifier): Promise<Nullable<User>> {
    const user = await this.usersRepository.findUnique({
      where: { id: userId.value },
    });

    if (!user) return null;

    return PrismaUserMapper.toDomainModel(user);
  }

  public async save(user: User): Promise<void> {
    const userPersistanceModel = PrismaUserMapper.toPersistenceModel(user);
    await this.usersRepository.upsert({
      where: { id: user.id.value },
      create: userPersistanceModel,
      update: userPersistanceModel,
    });
  }
}

export { PrismaUserRepository };

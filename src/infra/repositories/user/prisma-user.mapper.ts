import { Identifier } from "@domain/shared/core";
import { User } from "@domain/user";
import { UserEmail } from "@domain/user/user-email";
import { UserGender } from "@domain/user/user-gender";
import { UserPasswordHash } from "@domain/user/user-password";
import { User as UserModel } from "@prisma/client";

export class PrismaUserMapper {
  public static toDomainModel(userModel: UserModel): User {
    return new User(
      userModel.name,
      UserEmail.create(userModel.email).getValue(),
      UserPasswordHash.create(userModel.passwordHash).getValue(),
      UserGender.fromValue(userModel.gender).getValue(),
      userModel.phone,
      userModel.birthDate,
      userModel.photo,
      userModel.country,
      userModel.verified,
      userModel.resetToken,
      userModel.resetTokenExpiration,
      [],
      new Identifier(userModel.id),
      userModel.createdAt,
      undefined, //todo
      userModel.updatedAt,
      undefined, //todo
      userModel.deletedAt ?? undefined,
      undefined //todo,
    );
  }

  public static toPersistenceModel(user: User): UserModel {
    const userModel: UserModel = {
      id: user.id.value,
      gender: user.gender.value,
      name: user.name,
      birthDate: user.birthDate,
      email: user.email.value,
      phone: user.phone,
      country: user.country,
      photo: user.photo ?? null,
      resetToken: user.resetToken,
      resetTokenExpiration: user.resetTokenExpiration,
      passwordHash: user.passwordHash.value,
      verified: user.verified,
      createdAt: user.createdAt,
      createdBy: user.createdBy.who, // Todo: do it correctl,
      updatedAt: user.updatedAt,
      updatedBy: user.updatedBy.who, // Todo: do it correctl,
      deletedAt: user.deletedAt ?? null,
      deletedBy: user.deletedBy?.who ?? null, // Todo: do it correctl,
    };

    return userModel;
  }
}

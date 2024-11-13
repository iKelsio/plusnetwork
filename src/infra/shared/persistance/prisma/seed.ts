import { User } from "@domain/user";
import { UserEmail } from "@domain/user/user-email";
import { UserGender, UserGenders } from "@domain/user/user-gender";
import { UserPasswordHash } from "@domain/user/user-password";
import { faker } from "@faker-js/faker";
import { PrismaUserMapper } from "@infra/repositories/user/prisma-user.mapper";
import { PrismaClient } from "@prisma/client";

async function main() {
  const prisma = new PrismaClient();
  try {
    const users = await prisma.user.createMany({
      data: (
        await Promise.all(
          Array.from({ length: 30 }).map(async () =>
            User.create({
              name: faker.person.fullName(),
              birthDate: faker.date.birthdate(),
              country: faker.location.country(),
              email: new UserEmail(faker.internet.email()),
              gender: UserGender.fromValue(
                faker.helpers.arrayElement(Object.values(UserGenders))
              ).getValue(),
              phone: faker.phone.number(),
              photo: faker.internet.url(),
              verified: false,
              passwordHash: (
                await UserPasswordHash.fromPlainPassword("admin123")
              ).getValue(),
            }).getValue()
          )
        )
      ).map(PrismaUserMapper.toPersistenceModel),
      skipDuplicates: true,
    });

    console.log("Created", users.count, " users!");
  } catch (error) {
    console.error(error);
  } finally {
    prisma.$disconnect();
  }
}

main();

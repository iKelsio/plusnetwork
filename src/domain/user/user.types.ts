import { EntityFlattened } from "@domain/shared/core";
import { UserEmail } from "./user-email";
import { UserGender } from "./user-gender";
import { UserPasswordHash } from "./user-password";

export interface IUserAttributes {
  name: string;
  birthDate: Date;
  email: UserEmail;
  passwordHash: UserPasswordHash;
  gender: UserGender;
  phone: string;
  country: string;
  photo: string | null;
  verified: boolean;
}

export type IUserEditableAttributes = Partial<
  Omit<IUserAttributes, "password">
>;

export type IUserFlattened = EntityFlattened<{
  name: string;
  birthDate: Date;
  email: string;
  passwordHash: string;
  gender: string;
  phone: string;
  country: string;
  photo: string | null;
  verified: boolean;
}>;

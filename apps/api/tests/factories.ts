import { faker } from "@faker-js/faker";
import type { User } from "drizzle/schemas/users";

export function makeUser(): Omit<User, "id" | "createdAt" | "updatedAt"> {
  return {
    displayName: faker.person.fullName(),
    username: faker.internet.userName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
  };
}

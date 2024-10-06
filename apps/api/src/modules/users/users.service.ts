import type { Repository } from "@/repositories";
import { DrizzleUsersRepository } from "@/repositories/drizzle/users.repository";
import { env } from "@/utils/env";
import { ConflictError, NotFoundError } from "@/utils/errors";
import { hash } from "@node-rs/bcrypt";
import type { User } from "drizzle/schemas/users";
import type { createUserBody, putUserBody } from "./users.schema";

export class UsersService {
  constructor(
    private readonly usersRepository: Repository<User> = new DrizzleUsersRepository(),
  ) {}

  createUser = async ({ username, email, password }: createUserBody) => {
    const [userWithSameEmail] = await this.usersRepository.findBy(
      "email",
      email,
    );
    if (userWithSameEmail)
      throw new ConflictError(`User with email '${email}' already exists`);

    const [userWithSameUsername] = await this.usersRepository.findBy(
      "username",
      username,
    );
    if (userWithSameUsername)
      throw new ConflictError(
        `User with username '${username}' already exists`,
      );

    const hashedPassword = await hash(password, env.SALT_ROUNDS);

    const user = this.usersRepository.create({
      username,
      email,
      password: hashedPassword,
    });

    return user;
  };

  getUsers = async () => {
    const users = await this.usersRepository.all();

    return users;
  };

  getUserById = async (id: string) => {
    const user = await this.usersRepository.find(id);
    if (!user) throw new NotFoundError(`couldn't find user with id '${id}'`);

    return user;
  };

  updateUserById = async (
    id: string,
    { username, email, password }: putUserBody,
  ) => {
    if (username) {
      const [userWithSameUsername] = await this.usersRepository.findBy(
        "username",
        username,
      );
      if (userWithSameUsername && userWithSameUsername.id !== id)
        throw new ConflictError(
          `User with username '${username}' already exists`,
        );
    }

    if (email) {
      const [userWithSameEmail] = await this.usersRepository.findBy(
        "email",
        email,
      );
      if (userWithSameEmail && userWithSameEmail.id !== id)
        throw new ConflictError(`User with email '${email}' already exists`);
    }

    const user = await this.usersRepository.update(id, {
      username,
      email,
      password,
    });
    if (!user) throw new NotFoundError(`couldn't find user with id '${id}'`);

    return user;
  };

  deleteUserById = async (id: string) => {
    const user = await this.usersRepository.find(id);
    if (!user) throw new NotFoundError(`couldn't find user with id '${id}'`);

    await this.usersRepository.delete(id);
  };
}

export const usersService = new UsersService();

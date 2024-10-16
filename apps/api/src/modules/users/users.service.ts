import type { Repository } from "@/repositories";
import { DrizzleUsersRepository } from "@/repositories/drizzle/users.repository";
import { env } from "@/utils/env";
import { ConflictError, NotFoundError } from "@/utils/errors";
import { hash } from "@node-rs/bcrypt";
import type { User } from "drizzle/schemas/users";
import type { signupBody } from "../auth/auth.schema";
import type { updateUserBody } from "./users.schema";

export class UsersService {
  constructor(
    private readonly usersRepository: Repository<User> = new DrizzleUsersRepository(),
  ) {}

  createUser = async ({
    displayName,
    username,
    email,
    password,
  }: signupBody) => {
    const [userWithSameEmail] = await this.usersRepository.findBy({
      email: email,
    });
    if (userWithSameEmail)
      throw new ConflictError(`User with email '${email}' already exists`);

    const [userWithSameUsername] = await this.usersRepository.findBy({
      username: username,
    });
    if (userWithSameUsername)
      throw new ConflictError(
        `User with username '${username}' already exists`,
      );

    const hashedPassword = await hash(password, env.SALT_ROUNDS);

    const user = this.usersRepository.create({
      displayName,
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

  getUserByUsername = async (username: string) => {
    const [user] = await this.usersRepository.findBy({ username: username });
    if (!user)
      throw new NotFoundError(`couldn't find user with username '${username}'`);

    return user;
  };

  getUserById = async (id: string) => {
    const user = await this.usersRepository.find(id);
    if (!user) throw new NotFoundError(`couldn't find user with id '${id}'`);

    return user;
  };

  updateUserByUsername = async (
    originalUsername: string,
    { username, email, password }: updateUserBody,
  ) => {
    if (username) {
      const [userWithSameUsername] = await this.usersRepository.findBy({
        username: username,
      });
      if (
        userWithSameUsername &&
        userWithSameUsername.username !== originalUsername
      )
        throw new ConflictError(
          `User with username '${username}' already exists`,
        );
    }

    if (email) {
      const [userWithSameEmail] = await this.usersRepository.findBy({
        email: email,
      });
      if (userWithSameEmail && userWithSameEmail.username !== originalUsername)
        throw new ConflictError(`User with email '${email}' already exists`);
    }

    const [user] = await this.usersRepository.updateBy(
      { username: originalUsername },
      {
        username,
        email,
        password,
      },
    );
    if (!user)
      throw new NotFoundError(
        `couldn't find user with username '${originalUsername}'`,
      );

    return user;
  };

  deleteUserByUsername = async (username: string) => {
    const [user] = await this.usersRepository.findBy({ username: username });
    if (!user)
      throw new NotFoundError(`couldn't find user with username '${username}'`);

    await this.usersRepository.delete(user.id);
  };
}

export const usersService = new UsersService();

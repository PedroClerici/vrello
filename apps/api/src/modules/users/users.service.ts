import type { UsersRepository } from "@/repositories";
import { DrizzleUsersRepository } from "@/repositories/drizzle/users.repository";
import { InMemoryUsersRepository } from "@/repositories/in-memory/users.repository";
import { env } from "@/utils/env";
import { NotFoundError } from "@/utils/errors";

export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository = env.NODE_ENV === "test"
      ? new InMemoryUsersRepository()
      : new DrizzleUsersRepository(),
  ) {}

  getUsers = async () => {
    const users = await this.usersRepository.getAll();

    return users;
  };

  getUserById = async (id: string) => {
    const user = await this.usersRepository.getById(id);
    if (!user)
      throw new NotFoundError(`couldn't find resource with id '${id}'`);

    return user;
  };
}

export const usersService = new UsersService();

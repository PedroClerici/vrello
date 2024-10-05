import type { User } from "drizzle/schemas/users";

export interface UsersRepository {
  getAll: () => Promise<User[]>;

  getById: (id: string) => Promise<User | undefined>;

  getByEmail: (email: string) => Promise<User | undefined>;

  create: (data: Omit<User, "id">) => Promise<User | undefined>;

  update: (id: string, data: Partial<User>) => Promise<User | undefined>;

  delete: (id: string) => Promise<void>;
}

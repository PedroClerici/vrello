import type { User } from "drizzle/schemas/users";
import type { Repository } from "..";

export class InMemoryUsersRepository implements Repository<User> {
  private users: User[] = [
    {
      id: crypto.randomUUID().toString(),
      username: "John_Doe",
      email: "john.doe@example.com",
      password: "randomHash",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: crypto.randomUUID().toString(),
      username: "Joe_Shmoe",
      email: "joe.shmoe@example.com",
      password: "anotherRandomHash",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  async create(
    data: Omit<User, "id" | "createdAt" | "updatedAt">,
  ): Promise<User> {
    const newUser = {
      ...data,
      id: crypto.randomUUID().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.users.push(newUser);
    return newUser;
  }

  async all(): Promise<User[]> {
    return this.users;
  }

  async find(id: string): Promise<User | undefined> {
    const index = this.users.findIndex((user) => user.id === id);
    return index !== -1 ? this.users[index] : undefined;
  }

  async findBy(
    key: Exclude<keyof User, number>,
    value: User[keyof User],
  ): Promise<User[]> {
    return this.users.filter((user) => user[key] === value);
  }

  async update(id: string, data: Partial<User>) {
    const index = this.users.findIndex((user) => user.id === id);
    this.users = this.users.map((user) =>
      user.id === id ? { ...user, ...data } : user,
    );

    return this.users[index];
  }

  async delete(id: string): Promise<void> {
    const index = this.users.findIndex((user) => user.id === id);
    if (index !== -1) {
      this.users.splice(index, 1);
    }
  }
}

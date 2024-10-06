import { db } from "drizzle";
import { eq } from "drizzle-orm";
import { type User, users } from "drizzle/schemas/users";
import type { Repository } from "..";

export class DrizzleUsersRepository implements Repository<User> {
  async create(
    data: Omit<User, "id" | "createdAt" | "updatedAt">,
  ): Promise<User | undefined> {
    const [user] = await db.insert(users).values(data).returning();
    if (!user) {
      return undefined;
    }

    return user;
  }

  async all(): Promise<User[]> {
    return await db.select().from(users);
  }

  async find(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    if (!user) {
      return undefined;
    }

    return user;
  }

  async findBy(
    key: Exclude<keyof User, number>,
    value: User[keyof User],
  ): Promise<User[]> {
    return await db.select().from(users).where(eq(users[key], value));
  }

  async update(id: string, data: Partial<User>) {
    const [user] = await db
      .update(users)
      .set({ ...data })
      .where(eq(users.id, id))
      .returning();
    if (!user) {
      return undefined;
    }

    return user;
  }

  async delete(id: string): Promise<void> {
    await db.delete(users).where(eq(users.id, id)).returning();
  }
}

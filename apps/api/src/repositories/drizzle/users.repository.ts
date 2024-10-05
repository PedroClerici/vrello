import { db } from "drizzle";
import { users, type User } from "drizzle/schemas/users";
import { eq } from "drizzle-orm";
import type { UsersRepository } from "..";

export class DrizzleUsersRepository implements UsersRepository {
  async create(data: Omit<User, "id">): Promise<User | undefined> {
    const [user] = await db.insert(users).values(data).returning();
    if (!user) {
      return undefined;
    }

    return user;
  }

  async getAll(): Promise<User[]> {
    return await db.select().from(users);
  }

  async getById(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    if (!user) {
      return undefined;
    }

    return user;
  }

  async getByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    if (!user) {
      return undefined;
    }

    return user;
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

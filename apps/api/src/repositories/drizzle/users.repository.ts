import { db } from "drizzle";
import { and, eq, type SQLWrapper } from "drizzle-orm";
import { type User, users } from "drizzle/schemas/users";
import type { Filter, Insert, Keys, Repository } from "..";

export class DrizzleUsersRepository implements Repository<User> {
  async create(data: Insert<User>) {
    const [user] = await db.insert(users).values(data).returning();
    if (!user) {
      return undefined;
    }

    return user;
  }

  async all() {
    return await db.select().from(users);
  }

  async find(id: string) {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    if (!user) {
      return undefined;
    }

    return user;
  }

  async findBy(key: Keys<User>, value: User[keyof User]): Promise<User[]>;
  async findBy(filter: Filter<User>): Promise<User[]>;
  async findBy(
    keyOrFilter: Keys<User> | Filter<User>,
    value?: User[keyof User],
  ) {
    if (typeof value === "string" && typeof keyOrFilter === "string") {
      return await db.select().from(users).where(eq(users[keyOrFilter], value));
    }

    const eqs: SQLWrapper[] = [];
    for (const [column, value] of Object.entries(keyOrFilter)) {
      eqs.push(eq(users[column as Keys<User>], value));
    }

    return await db
      .select()
      .from(users)
      .where(and(...eqs));
  }

  async update(id: string, data: Partial<User>): Promise<User | undefined> {
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

  async delete(id: string) {
    await db.delete(users).where(eq(users.id, id)).returning();
  }

  async deleteBy(key: Keys<User>, value: User[keyof User]): Promise<void>;
  async deleteBy(filter: Filter<User>): Promise<void>;
  async deleteBy(
    keyOrFilter: Keys<User> | Filter<User>,
    value?: User[keyof User],
  ) {
    if (typeof value === "string" && typeof keyOrFilter === "string") {
      await db.delete(users).where(eq(users[keyOrFilter], value));
    }

    const eqs: SQLWrapper[] = [];
    for (const [column, value] of Object.entries(keyOrFilter)) {
      eqs.push(eq(users[column as Keys<User>], value));
    }

    await db.delete(users).where(and(...eqs));
  }
}

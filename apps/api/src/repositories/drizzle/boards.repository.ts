import { db } from "drizzle";
import { type SQLWrapper, and, eq } from "drizzle-orm";
import type { Filter, Insert, Keys, Repository } from "..";
import { boards, type Board } from "drizzle/schemas/boards";

export class DrizzleBoardsRepository implements Repository<Board> {
  async create(data: Insert<Board>) {
    const [board] = await db.insert(boards).values(data).returning();
    if (!board) {
      return undefined;
    }

    return board;
  }

  async all() {
    return await db.select().from(boards);
  }

  async find(id: string) {
    const [user] = await db.select().from(boards).where(eq(boards.id, id));
    if (!user) {
      return undefined;
    }

    return user;
  }

  async findBy(filter: Filter<Board>) {
    const eqs: SQLWrapper[] = [];
    for (const [column, value] of Object.entries(filter)) {
      eqs.push(eq(boards[column as Keys<Board>], value));
    }

    return await db
      .select()
      .from(boards)
      .where(and(...eqs));
  }

  async update(id: string, data: Partial<Board>): Promise<Board | undefined> {
    const [user] = await db
      .update(boards)
      .set({ ...data })
      .where(eq(boards.id, id))
      .returning();
    if (!user) {
      return undefined;
    }

    return user;
  }

  async updateBy(filter: Filter<Board>, data: Partial<Board>) {
    const eqs: SQLWrapper[] = [];
    for (const [column, value] of Object.entries(filter)) {
      eqs.push(eq(boards[column as Keys<Board>], value));
    }

    return await db
      .update(boards)
      .set({ ...data })
      .where(and(...eqs))
      .returning();
  }

  async delete(id: string) {
    await db.delete(boards).where(eq(boards.id, id)).returning();
  }

  async deleteBy(filter: Filter<Board>) {
    const eqs: SQLWrapper[] = [];
    for (const [column, value] of Object.entries(filter)) {
      eqs.push(eq(boards[column as Keys<Board>], value));
    }

    await db.delete(boards).where(and(...eqs));
  }
}

import { db } from "drizzle";
import { type SQLWrapper, and, eq } from "drizzle-orm";
import {
  type RefreshToken,
  refreshTokens,
} from "drizzle/schemas/refresh-tokens";
import type { Filter, Insert, Keys, Repository } from "..";

export class DrizzleRefreshTokensRepository
  implements Repository<RefreshToken>
{
  async create(data: Insert<RefreshToken>) {
    const [refreshToken] = await db
      .insert(refreshTokens)
      .values(data)
      .returning();
    if (!refreshToken) {
      return undefined;
    }

    return refreshToken;
  }

  async all() {
    return await db.select().from(refreshTokens);
  }

  async find(id: string) {
    const [refreshToken] = await db
      .select()
      .from(refreshTokens)
      .where(eq(refreshTokens.id, id));
    if (!refreshToken) {
      return undefined;
    }

    return refreshToken;
  }

  async findBy(filter: Filter<RefreshToken>) {
    const eqs: SQLWrapper[] = [];
    for (const [column, value] of Object.entries(filter)) {
      eqs.push(eq(refreshTokens[column as Keys<RefreshToken>], value));
    }

    return await db
      .select()
      .from(refreshTokens)
      .where(and(...eqs));
  }

  async update(id: string, data: Partial<RefreshToken>) {
    const [refreshToken] = await db
      .update(refreshTokens)
      .set({ ...data })
      .where(eq(refreshTokens.id, id))
      .returning();
    if (!refreshToken) {
      return undefined;
    }

    return refreshToken;
  }

  async updateBy(filter: Filter<RefreshToken>, data: Partial<RefreshToken>) {
    const eqs: SQLWrapper[] = [];
    for (const [column, value] of Object.entries(filter)) {
      eqs.push(eq(refreshTokens[column as Keys<RefreshToken>], value));
    }

    return await db
      .update(refreshTokens)
      .set({ ...data })
      .where(and(...eqs))
      .returning();
  }

  async delete(id: string) {
    await db.delete(refreshTokens).where(eq(refreshTokens.id, id)).returning();
  }

  async deleteBy(filter: Filter<RefreshToken>) {
    const eqs: SQLWrapper[] = [];
    for (const [column, value] of Object.entries(filter)) {
      eqs.push(eq(refreshTokens[column as Keys<RefreshToken>], value));
    }

    await db.delete(refreshTokens).where(and(...eqs));
  }
}

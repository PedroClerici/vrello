import { pgTable, uuid } from "drizzle-orm/pg-core";
import { users } from "./users";
import { boards } from "./boards";
import { relations } from "drizzle-orm";

export const boardMembers = pgTable("board_members", {
  boardId: uuid("board_id")
    .notNull()
    .references(() => boards.id),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id),
});

export const boardMembersRelations = relations(boardMembers, ({ one }) => ({
  board: one(boards, {
    fields: [boardMembers.boardId],
    references: [boards.id],
  }),
  user: one(users, {
    fields: [boardMembers.userId],
    references: [users.id],
  }),
}));

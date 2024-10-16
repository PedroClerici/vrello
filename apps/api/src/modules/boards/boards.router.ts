import type { FastifyInstance } from "fastify";
import { boardsController } from "./boards.controller";
import {
  createBoardSchema,
  deleteBoardByIdSchema,
  getBoardByIdSchema,
  getBoardsSchema,
  updateBoardByIdSchema,
} from "./boards.schema";
import { verifyJwtHook } from "@/hooks/verify-jwt.hook";

export async function boardsRouter(app: FastifyInstance) {
  app.post(
    "",
    { schema: createBoardSchema, preHandler: [verifyJwtHook] },
    boardsController.createBoard,
  );
  app.get("", { schema: getBoardsSchema }, boardsController.getBoards);
  app.get(
    "/:id",
    { schema: getBoardByIdSchema },
    boardsController.getBoardById,
  );
  app.patch(
    "/:id",
    { schema: updateBoardByIdSchema },
    boardsController.updateBoardById,
  );
  app.delete(
    "/:id",
    { schema: deleteBoardByIdSchema },
    boardsController.deleteBoardById,
  );
}

import type { FastifyInstance } from "fastify";
import { usersController } from "./users.controller";
import {
  deleteUserByIdSchema,
  getUserByIdSchema,
  getUsersSchema,
  putUserSchema,
} from "./users.schema";

export async function usersRouter(app: FastifyInstance) {
  app.get("", { schema: getUsersSchema }, usersController.getUsers);
  app.get("/:id", { schema: getUserByIdSchema }, usersController.getUserById);
  app.patch("/:id", { schema: putUserSchema }, usersController.updateUserById);
  app.delete(
    "/:id",
    { schema: deleteUserByIdSchema },
    usersController.deleteUserById,
  );
}

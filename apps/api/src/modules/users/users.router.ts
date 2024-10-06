import type { FastifyInstance } from "fastify";
import { usersController } from "./users.controller";
import {
  createUserSchema,
  deleteUserByIdSchema,
  getUserByIdSchema,
  getUsersSchema,
  putUserSchema,
} from "./users.schema";

export async function usersRouter(app: FastifyInstance) {
  app.post("", { schema: createUserSchema }, usersController.createUser);
  app.get("", { schema: getUsersSchema }, usersController.getUsers);
  app.get("/:id", { schema: getUserByIdSchema }, usersController.getUserById);
  app.patch("/:id", { schema: putUserSchema }, usersController.updateUserById);
  app.delete(
    "/:id",
    { schema: deleteUserByIdSchema },
    usersController.deleteUserById,
  );
}

import type { FastifyInstance } from "fastify";
import { usersController } from "./users.controller";
import {
  deleteUserByUsernameSchema,
  getUserByUsernameSchema,
  getUsersSchema,
  putUserSchema,
} from "./users.schema";

export async function usersRouter(app: FastifyInstance) {
  app.get("", { schema: getUsersSchema }, usersController.getUsers);
  app.get(
    "/:username",
    { schema: getUserByUsernameSchema },
    usersController.getUserByUsername,
  );
  app.patch(
    "/:username",
    { schema: putUserSchema },
    usersController.updateUserByUsername,
  );
  app.delete(
    "/:username",
    { schema: deleteUserByUsernameSchema },
    usersController.deleteUserByUsername,
  );
}

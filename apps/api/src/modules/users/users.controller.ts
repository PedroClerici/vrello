import type { FastifyReply, FastifyRequest } from "fastify";
import type {
  deleteUserByUsernameParams,
  getUserByUsernameParams,
  updateUserBody,
  updateUserParams,
} from "./users.schema";
import { usersService } from "./users.service";

class UsersController {
  getUsers = async (_request: FastifyRequest, reply: FastifyReply) => {
    const users = await usersService.getUsers();
    reply.status(200).send(users);
  };

  getUserByUsername = async (
    request: FastifyRequest<{ Params: getUserByUsernameParams }>,
    reply: FastifyReply,
  ) => {
    const { username } = request.params;
    const user = await usersService.getUserByUsername(username);
    reply.status(200).send(user);
  };

  updateUserByUsername = async (
    request: FastifyRequest<{ Params: updateUserParams; Body: updateUserBody }>,
    reply: FastifyReply,
  ) => {
    const { username } = request.params;
    const payload = request.body;
    const user = await usersService.updateUserByUsername(username, payload);
    reply.status(200).send(user);
  };

  deleteUserByUsername = async (
    request: FastifyRequest<{ Params: deleteUserByUsernameParams }>,
    reply: FastifyReply,
  ) => {
    const { username } = request.params;
    const user = await usersService.deleteUserByUsername(username);
    reply.status(200).send(user);
  };
}

export const usersController = new UsersController();

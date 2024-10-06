import type { FastifyReply, FastifyRequest } from "fastify";
import type {
  createUserBody,
  deleteUserByIdParams,
  getUserByIdParams,
  putUserBody,
  putUserParams,
} from "./users.schema";
import { usersService } from "./users.service";

class UsersController {
  createUser = async (
    request: FastifyRequest<{ Body: createUserBody }>,
    reply: FastifyReply,
  ) => {
    const payload = request.body;
    const user = await usersService.createUser(payload);
    reply.status(201).send(user);
  };

  getUsers = async (_request: FastifyRequest, reply: FastifyReply) => {
    const users = await usersService.getUsers();
    reply.status(200).send(users);
  };

  getUserById = async (
    request: FastifyRequest<{ Params: getUserByIdParams }>,
    reply: FastifyReply,
  ) => {
    const { id } = request.params;
    const user = await usersService.getUserById(id);
    reply.status(200).send(user);
  };

  updateUserById = async (
    request: FastifyRequest<{ Params: putUserParams; Body: putUserBody }>,
    reply: FastifyReply,
  ) => {
    const { id } = request.params;
    const payload = request.body;
    const user = await usersService.updateUserById(id, payload);
    reply.status(200).send(user);
  };

  deleteUserById = async (
    request: FastifyRequest<{ Params: deleteUserByIdParams }>,
    reply: FastifyReply,
  ) => {
    const { id } = request.params;
    const user = await usersService.deleteUserById(id);
    reply.status(200).send(user);
  };
}

export const usersController = new UsersController();

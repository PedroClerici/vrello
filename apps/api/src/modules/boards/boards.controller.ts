import type { FastifyReply, FastifyRequest } from "fastify";
import { boardsService } from "./boards.service";
import type {
  createBoardBody,
  createBoardHeaders,
  deleteBoardByIdParams,
  getBoardByIdParams,
  updateBoardByIdBody,
  updateBoardByIdParams,
} from "./boards.schema";

class BoardsController {
  createBoard = async (
    request: FastifyRequest<{
      Headers: createBoardHeaders;
      Body: createBoardBody;
    }>,
    reply: FastifyReply,
  ) => {
    const payload = request.body;
    const board = await boardsService.createBoard({
      author: request.user.id,
      ...payload,
    });
    reply.status(200).send(board);
  };

  getBoards = async (_request: FastifyRequest, reply: FastifyReply) => {
    const boards = await boardsService.getBoards();
    reply.status(200).send(boards);
  };

  getBoardById = async (
    request: FastifyRequest<{ Params: getBoardByIdParams }>,
    reply: FastifyReply,
  ) => {
    const { id } = request.params;
    const board = await boardsService.getBoardsById(id);
    reply.status(200).send(board);
  };

  updateBoardById = async (
    request: FastifyRequest<{
      Params: updateBoardByIdParams;
      Body: updateBoardByIdBody;
    }>,
    reply: FastifyReply,
  ) => {
    const { id } = request.params;
    const payload = request.body;
    const board = await boardsService.updateBoardById(
      id,
      request.user.id,
      payload,
    );
    reply.status(200).send(board);
  };

  deleteBoardById = async (
    request: FastifyRequest<{ Params: deleteBoardByIdParams }>,
    reply: FastifyReply,
  ) => {
    const { id } = request.params;
    const board = await boardsService.deleteBoardById(id);
    reply.status(200).send(board);
  };
}

export const boardsController = new BoardsController();

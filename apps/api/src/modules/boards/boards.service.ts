import type { Repository } from "@/repositories";
import { DrizzleBoardsRepository } from "@/repositories/drizzle/boards.repository";
import { ConflictError, NotFoundError } from "@/utils/errors";
import type { Board } from "drizzle/schemas/boards";

export class BoardsService {
  constructor(
    private readonly boardsRepository: Repository<Board> = new DrizzleBoardsRepository(),
  ) {}

  async createBoard({
    name,
    author,
    description,
  }: Omit<Board, "id" | "createdAt" | "updatedAt">) {
    const [boardWithSameName] = await this.boardsRepository.findBy({
      name: name,
      author: author,
    });
    if (boardWithSameName)
      throw new ConflictError(`User with board name '${name}' already exists`);

    const board = this.boardsRepository.create({
      name,
      author,
      description,
    });

    return board;
  }

  getBoards = async () => {
    const users = await this.boardsRepository.all();

    return users;
  };

  getBoardsById = async (id: string) => {
    const [board] = await this.boardsRepository.findBy({ id: id });
    if (!board) throw new NotFoundError(`couldn't find board with id '${id}'`);

    return board;
  };

  updateBoardById = async (
    id: string,
    author: string,
    { name, description }: Partial<Board>,
  ) => {
    if (name) {
      const [boardWithSameName] = await this.boardsRepository.findBy({
        name: name,
        author: author,
      });
      if (boardWithSameName)
        throw new ConflictError(`Board with name '${name}' already exists`);
    }
    const [board] = await this.boardsRepository.updateBy(
      { id: id },
      {
        name,
        description,
      },
    );
    if (!board) throw new NotFoundError(`couldn't find board with id '${id}'`);

    return board;
  };

  deleteBoardById = async (id: string) => {
    const [board] = await this.boardsRepository.findBy({ id: id });
    if (!board) throw new NotFoundError(`couldn't find board with id '${id}'`);

    await this.boardsRepository.delete(board.id);
  };
}

export const boardsService = new BoardsService();

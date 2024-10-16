import { boardSchema } from "@/schemas/boards.schema";
import { headerSchema } from "@/schemas/headers.schema";
import type { FastifyZodOpenApiSchema } from "fastify-zod-openapi";
import { z } from "zod";

export const boardResponseSchema = boardSchema;

export type createBoardHeaders = z.infer<typeof createBoardSchema.headers>;
export type createBoardBody = z.infer<typeof createBoardSchema.body>;
export const createBoardSchema = {
  tags: ["Boards"],
  headers: headerSchema,
  body: boardSchema.pick({
    name: true,
    description: true,
  }),
  response: { 200: boardResponseSchema },
} satisfies FastifyZodOpenApiSchema;

export type getBoardByIdParams = z.infer<typeof getBoardByIdSchema.params>;
export const getBoardByIdSchema = {
  tags: ["Boards"],
  params: boardSchema.pick({ id: true }),
  response: { 200: boardResponseSchema },
} satisfies FastifyZodOpenApiSchema;

export const getBoardsSchema = {
  tags: ["Boards"],
  response: { 200: z.array(boardResponseSchema) },
} satisfies FastifyZodOpenApiSchema;

export type updateBoardByIdParams = z.infer<
  typeof updateBoardByIdSchema.params
>;
export type updateBoardByIdBody = z.infer<typeof updateBoardByIdSchema.body>;
export const updateBoardByIdSchema = {
  tags: ["Boards"],
  params: boardSchema.pick({ id: true }),
  body: boardSchema.pick({ name: true, description: true }).partial(),
  response: { 200: boardResponseSchema },
} satisfies FastifyZodOpenApiSchema;

export type deleteBoardByIdParams = z.infer<
  typeof deleteBoardByIdSchema.params
>;
export const deleteBoardByIdSchema = {
  tags: ["Boards"],
  params: boardSchema.pick({ id: true }),
  response: { 204: {} },
} satisfies FastifyZodOpenApiSchema;

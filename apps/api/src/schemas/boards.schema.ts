import "zod-openapi/extend";
import type { Board } from "drizzle/schemas/boards";
import { z } from "zod";

export const boardSchema = z.object({
  id: z.string().uuid().openapi({
    description: "User ID",
  }),
  name: z.string().openapi({
    description: "Board Name",
    example: "Todo",
  }),
  description: z.string().openapi({
    description: "Board Description",
    example: "My todos board",
  }),
  author: z.string().uuid().openapi({
    description: "Board Author's ID",
  }),
  createdAt: z.string().refine((arg) => new Date(arg)),
  updatedAt: z.string().refine((arg) => new Date(arg)),
}) satisfies z.ZodSchema<Board>;

import "zod-openapi/extend";
import { z } from "zod";

export const headerSchema = z.object({
  Authorization: z.string().default("Bearer"),
});

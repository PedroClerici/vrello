import "zod-openapi/extend";
import type { User } from "drizzle/schemas/users";
import { z } from "zod";

export const userSchema = z.object({
  id: z.string().uuid().openapi({
    description: "User ID",
  }),
  displayName: z.string().openapi({
    description: "Display Name",
    example: "John Doe",
  }),
  username: z.string().openapi({
    description: "Username",
    example: "john.doe",
  }),
  email: z.string().email().openapi({
    description: "Email address",
    example: "john.doe@example.com",
  }),
  password: z.string().openapi({
    example: "MyP@ssw0rd!",
  }),
  createdAt: z.string().refine((arg) => new Date(arg)),
  updatedAt: z.string().refine((arg) => new Date(arg)),
}) satisfies z.ZodSchema<User>;

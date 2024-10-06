import { userSchema } from "@/schemas/users.schema";
import type { FastifySchema } from "fastify";
import { z } from "zod";

export const userResponseSchema = userSchema.omit({
  password: true,
});

export type createUserBody = z.infer<typeof createUserSchema.body>;
export const createUserSchema = {
  tags: ["Users"],
  body: userSchema.pick({ username: true, email: true, password: true }),
  response: { 200: userResponseSchema },
} satisfies FastifySchema;

export type getUserByIdParams = z.infer<typeof getUserByIdSchema.params>;
export const getUserByIdSchema = {
  tags: ["Users"],
  params: userSchema.pick({ id: true }),
  response: { 200: userResponseSchema },
} satisfies FastifySchema;

export const getUsersSchema = {
  tags: ["Users"],
  response: { 200: z.array(userResponseSchema) },
} satisfies FastifySchema;

export type putUserParams = z.infer<typeof putUserSchema.params>;
export type putUserBody = z.infer<typeof putUserSchema.body>;
export const putUserSchema = {
  tags: ["Users"],
  params: userSchema.pick({ id: true }),
  body: userSchema
    .pick({ username: true, email: true, password: true })
    .partial(),
  response: { 200: userResponseSchema },
};

export type deleteUserByIdParams = z.infer<typeof getUserByIdSchema.params>;
export const deleteUserByIdSchema = {
  tags: ["Users"],
  params: userSchema.pick({ id: true }),
  response: { 204: {} },
} satisfies FastifySchema;

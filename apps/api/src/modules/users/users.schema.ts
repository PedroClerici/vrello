import { userSchema } from "@/schemas/users.schema";
import type { FastifyZodOpenApiSchema } from "fastify-zod-openapi";
import { z } from "zod";

export const userResponseSchema = userSchema.omit({
  password: true,
});

export type getUserByUsernameParams = z.infer<
  typeof getUserByUsernameSchema.params
>;
export const getUserByUsernameSchema = {
  tags: ["Users"],
  params: userSchema.pick({ username: true }),
  response: { 200: userResponseSchema },
} satisfies FastifyZodOpenApiSchema;

export const getUsersSchema = {
  tags: ["Users"],
  response: { 200: z.array(userResponseSchema) },
} satisfies FastifyZodOpenApiSchema;

export type updateUserParams = z.infer<typeof updateUserSchema.params>;
export type updateUserBody = z.infer<typeof updateUserSchema.body>;
export const updateUserSchema = {
  tags: ["Users"],
  params: userSchema.pick({ username: true }),
  body: userSchema
    .pick({ displayName: true, username: true, email: true, password: true })
    .partial(),
  response: { 200: userResponseSchema },
} satisfies FastifyZodOpenApiSchema;

export type deleteUserByUsernameParams = z.infer<
  typeof getUserByUsernameSchema.params
>;
export const deleteUserByUsernameSchema = {
  tags: ["Users"],
  params: userSchema.pick({ username: true }),
  response: { 204: {} },
} satisfies FastifyZodOpenApiSchema;

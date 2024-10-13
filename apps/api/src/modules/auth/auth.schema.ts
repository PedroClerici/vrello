import { headerSchema } from "@/schemas/headers.schema";
import { userSchema } from "@/schemas/users.schema";
import type { FastifyZodOpenApiSchema } from "fastify-zod-openapi";
import { z } from "zod";
import { userResponseSchema } from "../users/users.schema";

const tokenSchema = z.object({
  token: z.string(),
});

export type loginBody = z.infer<typeof loginSchema.body>;
export const loginSchema = {
  tags: ["Auth"],
  body: userSchema.pick({ email: true, password: true }),
  response: { 200: tokenSchema },
} satisfies FastifyZodOpenApiSchema;

export type signupBody = z.infer<typeof signupSchema.body>;
export const signupSchema = {
  tags: ["Auth"],
  body: userSchema.pick({
    displayName: true,
    username: true,
    email: true,
    password: true,
  }),
  response: { 200: {} },
} satisfies FastifyZodOpenApiSchema;

export const refreshSchema = {
  tags: ["Auth"],
  headers: headerSchema,
  response: { 200: tokenSchema },
} satisfies FastifyZodOpenApiSchema;

export const profileSchema = {
  tags: ["Auth"],
  headers: headerSchema,
  response: { 200: userResponseSchema },
} satisfies FastifyZodOpenApiSchema;

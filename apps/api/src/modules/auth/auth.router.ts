import { verifyJwtHook } from "@/hooks/verify-jwt.hook";
import type { FastifyInstance } from "fastify";
import { authController } from "./auth.controller";
import {
  loginSchema,
  profileSchema,
  refreshSchema,
  signupSchema,
} from "./auth.schema";

export async function authRouter(app: FastifyInstance) {
  app.post("/signup", { schema: signupSchema }, authController.signup);
  app.post("/login", { schema: loginSchema }, authController.login);
  app.patch("/refresh", { schema: refreshSchema }, authController.refresh);
  app.get(
    "/profile",
    { schema: profileSchema, preHandler: [verifyJwtHook] },
    authController.profile,
  );
}

import "zod-openapi/extend";
import fastifyCookie from "@fastify/cookie";
import fastifyJwt from "@fastify/jwt";
import fastifySwagger from "@fastify/swagger";
import fastifyScalarUI from "@scalar/fastify-api-reference";
import { fastify } from "fastify";
import {
  type FastifyZodOpenApiTypeProvider,
  fastifyZodOpenApiPlugin,
  fastifyZodOpenApiTransform,
  fastifyZodOpenApiTransformObject,
  serializerCompiler,
  validatorCompiler,
} from "fastify-zod-openapi";
import { authRouter } from "./modules/auth/auth.router";
import { usersRouter } from "./modules/users/users.router";
import { env } from "./utils/env";
import { makeError } from "./utils/errors";
import { loggerConfig } from "./utils/logger";
import healthRouter from "./modules/health/health.router";

export const app = fastify({
  logger: loggerConfig[env.NODE_ENV],
});

app.withTypeProvider<FastifyZodOpenApiTypeProvider>();
app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

await app.register(fastifyZodOpenApiPlugin);

await app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
  cookie: {
    cookieName: "refreshToken",
    signed: false,
  },
});

await app.register(fastifyCookie);

await app.register(fastifySwagger, {
  openapi: {
    info: {
      title: "Vrello API Docs",
      version: "0.0.1",
    },
  },
  transform: fastifyZodOpenApiTransform,
  transformObject: fastifyZodOpenApiTransformObject,
});

await app.register(fastifyScalarUI, {
  routePrefix: "/docs",
  configuration: {
    theme: "kepler",
  },
});

app.setErrorHandler(async (err, request, reply) => {
  const error = makeError(err);
  if (error.statusCode === 500) {
    request.log.error(err);
    console.error(err);
  }

  return reply.status(error.statusCode).send(error);
});

await app.register((app, _, done) => {
  app.register(healthRouter);
  app.register(authRouter);
  app.register(usersRouter, { prefix: "/users" });

  done();
});

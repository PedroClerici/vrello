import { UnauthorizedError } from "@/utils/errors";
import type { SignPayloadType } from "@fastify/jwt";
import type { FastifyReply, FastifyRequest } from "fastify";
import { usersService } from "../users/users.service";
import type { loginBody, signupBody } from "./auth.schema";
import { authService } from "./auth.service";

class AuthController {
  signup = async (
    request: FastifyRequest<{ Body: signupBody }>,
    reply: FastifyReply,
  ) => {
    const payload = request.body;
    await usersService.createUser(payload);
    reply.status(201).send();
  };

  login = async (
    request: FastifyRequest<{ Body: loginBody }>,
    reply: FastifyReply,
  ) => {
    const { email, password } = request.body;

    const { authTokenPayload, refreshTokenPayload } = await authService.login({
      email,
      password,
    });

    const authToken = await reply.jwtSign(authTokenPayload);

    const refreshToken = await reply.jwtSign(refreshTokenPayload);

    return reply
      .setCookie("refreshToken", refreshToken, {
        path: "/",
        secure: true,
        sameSite: true,
        httpOnly: true,
      })
      .status(200)
      .send({ token: authToken });
  };

  refresh = async (request: FastifyRequest, reply: FastifyReply) => {
    const oldRefreshToken = await request.jwtVerify<SignPayloadType>({
      onlyCookie: true,
    });
    request.log.debug(oldRefreshToken);
    if (!oldRefreshToken) throw new UnauthorizedError("Unauthorized");

    const { authTokenPayload, refreshTokenPayload } =
      await authService.refresh(oldRefreshToken);

    const authToken = await reply.jwtSign(authTokenPayload);

    const refreshToken = await reply.jwtSign(refreshTokenPayload);

    return reply
      .setCookie("refreshToken", refreshToken, {
        path: "/",
        secure: true,
        sameSite: true,
        httpOnly: true,
      })
      .status(200)
      .send({ token: authToken });
  };

  profile = async (request: FastifyRequest, reply: FastifyReply) => {
    const user = await usersService.getUserById(request.user.id);

    reply.status(200).send(user);
  };
}

export const authController = new AuthController();

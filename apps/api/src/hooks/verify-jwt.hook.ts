import type { headerSchema } from "@/schemas/headers.schema";
import { UnauthorizedError } from "@/utils/errors";
import type { FastifyReply, FastifyRequest } from "fastify";
import type { z } from "zod";

export type Headers = z.infer<typeof headerSchema>;

export async function verifyJwtHook(
  request: FastifyRequest<{ Headers: Headers }>,
  _: FastifyReply,
) {
  const token = request.headers.Authorization;
  if (!token) throw new UnauthorizedError("Unauthorized");

  let decodedToken: { sub: string; type: "auth" | "refresh" } | null = null;
  try {
    decodedToken = await request.jwtVerify<{
      sub: string;
      type: "auth" | "refresh";
    }>();
  } catch {
    throw new UnauthorizedError("Unauthorized");
  }
  request.log.debug(decodedToken, "token");
  if (!decodedToken.sub || decodedToken.type !== "auth")
    throw new UnauthorizedError("Unauthorized");

  request.user = { id: decodedToken.sub };
}

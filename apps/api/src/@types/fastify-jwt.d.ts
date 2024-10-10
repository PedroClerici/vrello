import "@fastify/jwt";

declare module "@fastify/jwt" {
  interface FastifyJWT {
    payload: {
      sub: string;
      type: "auth" | "refresh";
      jti: string;
      exp: number;
    };
    user: { id: string };
  }

  export interface JwtPayload {
    type: "auth" | "refresh";
  }
}

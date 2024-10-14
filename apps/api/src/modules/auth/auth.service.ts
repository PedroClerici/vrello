import type { Repository } from "@/repositories";
import { DrizzleRefreshTokensRepository } from "@/repositories/drizzle/refresh-token.repository";
import { DrizzleUsersRepository } from "@/repositories/drizzle/users.repository";
import { env } from "@/utils/env";
import { UnauthorizedError } from "@/utils/errors";
import type { SignPayloadType } from "@fastify/jwt";
import { compare } from "@node-rs/bcrypt";
import type { RefreshToken } from "drizzle/schemas/refresh-tokens";
import type { User } from "drizzle/schemas/users";
import type { loginBody } from "./auth.schema";

class AuthService {
  constructor(
    private readonly usersRepository: Repository<User> = new DrizzleUsersRepository(),
    private readonly refreshTokenRepository: Repository<RefreshToken> = new DrizzleRefreshTokensRepository(),
  ) {}

  private async createAuthToken(userId: string) {
    const payload = {
      type: "auth",
      exp:
        Math.floor(Date.now() / 1000) +
        env.JWT_AUTH_TOKEN_EXPIRE_IN_MINUTES * 60,
      sub: userId,
    } as SignPayloadType;

    return payload;
  }

  private async createRefreshToken(userId: string) {
    const refreshToken = await this.refreshTokenRepository.create({
      exp:
        Math.floor(Date.now() / 1000) +
        env.JWT_REFRESH_TOKEN_EXPIRE_IN_DAYS * 24 * 60 * 60,
      userId,
    });
    if (!refreshToken) throw new Error("couldn't create refreshToken");

    const payload = {
      type: "refresh",
      exp: refreshToken.exp,
      jti: refreshToken.id,
      sub: userId,
    } as SignPayloadType;

    return payload;
  }

  async login({ email, password }: loginBody) {
    const [user] = await this.usersRepository.findBy({ email: email });
    if (!user)
      throw new UnauthorizedError(
        "The provided username and password combination is incorrect.",
      );

    const doesPasswordMatches = await compare(password, user.password);
    if (!doesPasswordMatches)
      throw new UnauthorizedError(
        "The provided username and password combination is incorrect.",
      );

    const authTokenPayload = await this.createAuthToken(user.id);
    const refreshTokenPayload = await this.createRefreshToken(user.id);

    return { authTokenPayload, refreshTokenPayload };
  }

  async refresh(refreshToken: SignPayloadType) {
    const savedRefreshToken = await this.refreshTokenRepository.find(
      refreshToken.jti,
    );
    if (!savedRefreshToken)
      throw new UnauthorizedError("Invalid refresh token");

    await this.refreshTokenRepository.delete(savedRefreshToken.id);

    const authTokenPayload = await this.createAuthToken(
      savedRefreshToken.userId,
    );

    const refreshTokenPayload = await this.createRefreshToken(
      savedRefreshToken.userId,
    );

    return { authTokenPayload, refreshTokenPayload };
  }
}

export const authService = new AuthService();

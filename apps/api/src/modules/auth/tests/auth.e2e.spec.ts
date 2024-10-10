import { faker } from "@faker-js/faker";
import axios from "axios";
import { inject } from "vitest";

describe("Auth API Endpoints", async () => {
  beforeAll(async () => {
    axios.defaults.baseURL = inject("apiUrl");
    axios.defaults.validateStatus = () => true;
  });

  describe("POST /signup", async () => {
    it("Should be able create user", async () => {
      const response = await axios.post("/signup", {
        username: faker.internet.userName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
      });

      expect(response.status).toBe(201);
    });

    it("Should not be able create user with same username", async () => {
      const user = {
        username: faker.internet.userName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
      };

      await axios.post("/signup", { ...user });

      const response = await axios.post("/signup", {
        username: user.username,
        email: faker.internet.email(),
        password: faker.internet.password(),
      });

      expect(response.status).toBe(409);
    });

    it("Should not be able create user with same email", async () => {
      const user = {
        username: faker.internet.userName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
      };

      await axios.post("/signup", { ...user });

      const response = await axios.post("/signup", {
        username: faker.internet.userName(),
        email: user.email,
        password: faker.internet.password(),
      });

      expect(response.status).toBe(409);
    });
  });

  describe("POST /login", async () => {
    it("Should be able login user", async () => {
      const user = {
        username: faker.internet.userName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
      };

      await axios.post("/signup", { ...user });

      const response = await axios.post("/login", {
        email: user.email,
        password: user.password,
      });

      expect(response.status).toBe(200);
    });
  });

  describe("POST /refresh", async () => {
    it("Should be able to refresh token", async () => {
      const user = {
        username: faker.internet.userName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
      };

      await axios.post("/signup", { ...user });
      const { headers } = await axios.post("/login", {
        email: user.email,
        password: user.password,
      });

      const refreshToken = headers["set-cookie"]
        ?.at(0)
        ?.split(";")
        ?.at(0)
        ?.split("=")
        ?.at(1) as string;

      const response = await axios.patch(
        "/refresh",
        {},
        { headers: { Cookie: `refreshToken=${refreshToken}` } },
      );

      expect(response.status).toBe(200);
    });
  });

  describe("GET /profile", async () => {
    it("Should be able to get user profile", async () => {
      const user = {
        username: faker.internet.userName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
      };

      await axios.post("/signup", { ...user });
      const {
        data: { token },
      } = await axios.post("/login", {
        email: user.email,
        password: user.password,
      });

      const response = await axios.get("/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });

      expect(response.status).toBe(200);
    });
  });
});

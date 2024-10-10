import { faker } from "@faker-js/faker";
import axios from "axios";
import type { User } from "drizzle/schemas/users";
import { inject } from "vitest";

describe("User API Endpoints", async () => {
  beforeAll(async () => {
    axios.defaults.baseURL = inject("apiUrl");
    axios.defaults.validateStatus = () => true;
  });

  describe("GET /users", async () => {
    it("Should be able to get users", async () => {
      const response = await axios.get("/users");

      expect(response.status).toBe(200);
    });
  });

  describe("GET /users/:id", async () => {
    it("Should be able to get users", async () => {
      let user: Partial<User> = {
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

      const { data } = await axios.get("/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });

      user = data;

      const response = await axios.get(`/users/${user.id}`);

      expect(response.status).toBe(200);
    });

    it("Should return a not found error for non-existent ID", async () => {
      const testId = crypto.randomUUID().toString();

      const response = await axios.get(`/users/${testId}`);

      expect(response.status).toBe(404);
    });
  });

  describe("PATCH /users/:id", async () => {
    it("Should be able to update user", async () => {
      let user: Partial<User> = {
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

      const { data } = await axios.get("/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });

      user = data;

      const response = await axios.patch(`/users/${user.id}`, {
        username: faker.internet.userName(),
        email: faker.internet.email(),
      });

      expect(response.status).toBe(200);
    });
  });
});

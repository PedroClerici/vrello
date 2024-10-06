import axios from "axios";
import { faker } from "@faker-js/faker";
import { inject } from "vitest";

describe("User API Endpoints", async () => {
  beforeAll(async () => {
    axios.defaults.baseURL = inject("apiUrl");
    axios.defaults.validateStatus = () => true;
  });

  describe("POST /users", async () => {
    it("Should be able create user", async () => {
      const response = await axios.post("/users", {
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

      await axios.post("/users", { ...user });

      const response = await axios.post("/users", {
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

      await axios.post("/users", { ...user });

      const response = await axios.post("/users", {
        username: faker.internet.userName(),
        email: user.email,
        password: faker.internet.password(),
      });

      expect(response.status).toBe(409);
    });
  });

  describe("GET /users", async () => {
    it("Should be able to get users", async () => {
      const response = await axios.get("/users");

      expect(response.status).toBe(200);
    });
  });

  describe("GET /users/:id", async () => {
    it("Should be able to get users", async () => {
      const { data: user } = await axios.post("/users", {
        username: faker.internet.userName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
      });

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
      const { data: user } = await axios.post("/users", {
        username: faker.internet.userName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
      });

      const response = await axios.patch(`/users/${user.id}`, {
        username: faker.internet.userName(),
        email: faker.internet.email(),
      });

      expect(response.status).toBe(200);
    });
  });
});

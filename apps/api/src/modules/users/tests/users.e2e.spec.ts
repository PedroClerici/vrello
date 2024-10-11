import { app } from "@/app";
import { faker } from "@faker-js/faker";
import type { User } from "drizzle/schemas/users";
import request from "supertest";

describe("User API Endpoints", async () => {
  beforeAll(() => {
    app.ready();
  });

  describe("GET /users", async () => {
    it("Should be able to get users", async () => {
      await request(app.server).get("/users").expect(200);
    });
  });

  describe("GET /users/:id", async () => {
    it("Should be able to get users", async () => {
      let user: Partial<User> = {
        username: faker.internet.userName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
      };

      await request(app.server)
        .post("/signup")
        .send({ ...user });

      const {
        body: { token },
      } = await request(app.server).post("/login").send({
        email: user.email,
        password: user.password,
      });

      const { body } = await request(app.server)
        .get("/profile")
        .set("Authorization", `Bearer ${token}`)
        .expect(200);

      user = body;

      await request(app.server).get(`/users/${user.id}`).expect(200);
    });

    it("Should return a not found error for non-existent ID", async () => {
      const testId = crypto.randomUUID().toString();

      await request(app.server).get(`/users/${testId}`).expect(404);
    });
  });

  describe("PATCH /users/:id", async () => {
    it("Should be able to update user", async () => {
      let user: Partial<User> = {
        username: faker.internet.userName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
      };

      await request(app.server)
        .post("/signup")
        .send({ ...user });

      const {
        body: { token },
      } = await request(app.server).post("/login").send({
        email: user.email,
        password: user.password,
      });

      const { body } = await request(app.server)
        .get("/profile")
        .set("Authorization", `Bearer ${token}`)
        .expect(200);

      user = body;

      const response = await request(app.server)
        .patch(`/users/${user.id}`)
        .send({
          username: faker.internet.userName(),
          email: faker.internet.email(),
        });

      expect(response.status).toBe(200);
    });
  });
});

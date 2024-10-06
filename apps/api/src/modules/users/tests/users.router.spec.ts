import { app } from "@/app";
import request from "supertest";
import { faker } from "@faker-js/faker";

describe("User API Endpoints", async () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => await app.close());

  describe("POST /users", async () => {
    it("Should be able create user", async () => {
      await request(app.server)
        .post("/users")
        .set("Accept", "application/json")
        .send({
          username: faker.internet.userName(),
          email: faker.internet.email(),
          password: faker.internet.password(),
        })
        .expect(201);
    });

    it("Should not be able create user with same username", async () => {
      const user = {
        username: faker.internet.userName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
      };

      await request(app.server)
        .post("/users")
        .set("Accept", "application/json")
        .send({ ...user });

      await request(app.server)
        .post("/users")
        .set("Accept", "application/json")
        .send({
          username: user.username,
          email: faker.internet.email(),
          password: faker.internet.password(),
        })
        .expect(409);
    });

    it("Should not be able create user with same email", async () => {
      const user = {
        username: faker.internet.userName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
      };

      await request(app.server)
        .post("/users")
        .set("Accept", "application/json")
        .send({ ...user });

      await request(app.server)
        .post("/users")
        .set("Accept", "application/json")
        .send({
          username: faker.internet.userName(),
          email: user.email,
          password: faker.internet.password(),
        })
        .expect(409);
    });
  });

  describe("GET /users", async () => {
    it("Should be able to get users", async () => {
      await request(app.server)
        .get("/users")
        .set("Accept", "application/json")
        .expect(200);
    });
  });

  describe("GET /users/:id", async () => {
    it("Should be able to get users", async () => {
      const user = await request(app.server)
        .post("/users")
        .set("Accept", "application/json")
        .send({
          username: faker.internet.userName(),
          email: faker.internet.email(),
          password: faker.internet.password(),
        });
      const testId = user.body.id;

      await request(app.server)
        .get(`/users/${testId}`)
        .set("Accept", "application/json")
        .expect(200);
    });

    it("Should return a not found error for non-existent ID", async () => {
      const testId = crypto.randomUUID().toString();

      await request(app.server)
        .get(`/users/${testId}`)
        .set("Accept", "application/json")
        .expect(404);
    });
  });

  describe("PATCH /users/:id", async () => {
    it("Should be able to update user", async () => {
      const user = await request(app.server)
        .post("/users")
        .set("Accept", "application/json")
        .send({
          username: faker.internet.userName(),
          email: faker.internet.email(),
          password: faker.internet.password(),
        });

      console.log({ user: user.body });
      await request(app.server)
        .patch(`/users/${user.body.id}`)
        .set("Accept", "application/json")
        .send({
          email: faker.internet.email(),
        })
        .expect(200);
    });
  });
});

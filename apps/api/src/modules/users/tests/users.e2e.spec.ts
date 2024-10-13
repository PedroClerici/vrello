import { app } from "@/app";
import { faker } from "@faker-js/faker";
import request from "supertest";
import { makeUser } from "tests/factories";

describe("User API Endpoints", async () => {
  beforeAll(() => {
    app.ready();
  });

  describe("GET /users", async () => {
    it("Should be able to get users", async () => {
      await request(app.server).get("/users").expect(200);
    });
  });

  describe("GET /users/:username", async () => {
    it("Should be able to get users", async () => {
      let user = makeUser();

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

      await request(app.server).get(`/users/${user.username}`).expect(200);
    });

    it("Should return a not found error for non-existent ID", async () => {
      const testUsername = faker.internet.userName();

      await request(app.server).get(`/users/${testUsername}`).expect(404);
    });
  });

  describe("PATCH /users/:username", async () => {
    it("Should be able to update user", async () => {
      let user = makeUser();

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
        .patch(`/users/${user.username}`)
        .send({
          username: faker.internet.userName(),
          email: faker.internet.email(),
        });

      expect(response.status).toBe(200);
    });
  });
});

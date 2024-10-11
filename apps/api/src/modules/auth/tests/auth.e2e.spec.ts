import { app } from "@/app";
import { faker } from "@faker-js/faker";
import request from "supertest";

describe("Auth API Endpoints", async () => {
  beforeAll(() => {
    app.ready();
  });

  describe("POST /signup", async () => {
    it("Should be able create user", async () => {
      await request(app.server)
        .post("/signup")
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
        .post("/signup")
        .send({ ...user });

      await request(app.server).post("/signup").send({
        username: user.username,
        email: faker.internet.email(),
        password: faker.internet.password(),
      });
    });

    it("Should not be able create user with same email", async () => {
      const user = {
        username: faker.internet.userName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
      };

      await request(app.server)
        .post("/signup")
        .send({ ...user });

      await request(app.server)
        .post("/signup")
        .send({
          username: faker.internet.userName(),
          email: user.email,
          password: faker.internet.password(),
        })
        .expect(409);
    });
  });

  describe("POST /login", async () => {
    it("Should be able login user", async () => {
      const user = {
        username: faker.internet.userName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
      };

      await request(app.server)
        .post("/signup")
        .send({ ...user });

      await request(app.server)
        .post("/login")
        .send({
          email: user.email,
          password: user.password,
        })
        .expect(200);
    });
  });

  describe("POST /refresh", async () => {
    it("Should be able to refresh token", async () => {
      const user = {
        username: faker.internet.userName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
      };

      await request(app.server)
        .post("/signup")
        .send({ ...user });

      const { headers } = await request(app.server)
        .post("/login")
        .send({
          email: user.email,
          password: user.password,
        })
        .expect(200);

      const refreshToken = headers["set-cookie"]
        ?.at(0)
        ?.split(";")
        ?.at(0)
        ?.split("=")
        ?.at(1) as string;

      await request(app.server)
        .patch("/refresh")
        .set("Cookie", [`refreshToken=${refreshToken}`])
        .expect(200);
    });
  });

  describe("GET /profile", async () => {
    it("Should be able to get user profile", async () => {
      const user = {
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

      await request(app.server)
        .get("/profile")
        .set("Authorization", `Bearer ${token}`)
        .expect(200);
    });
  });
});

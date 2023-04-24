const {
  describe,
  beforeAll,
  afterAll,
  afterEach,
  test,
  expect,
} = require("@jest/globals");
const mongoose = require("mongoose");
const request = require("supertest");
const app = require("../../app");
const { User } = require("../../models/user");

const { DB_HOST_TEST, PORT } = process.env;

// Test the register flow

describe("test /users/register route", () => {
  let server = null;
  beforeAll(async () => {
    server = app.listen(PORT);
    await mongoose.connect(DB_HOST_TEST);
  });

  afterAll(async () => {
    server.close();
    await mongoose.connection.close();
  });

  afterEach(async () => {
    await User.deleteMany({});
  });

  test("test register route with correct data", async () => {
    const registerData = {
      email: "test@gmail.com",
      password: "Test1234",
    };

    const res = await request(app).post("/users/register").send(registerData);
    expect(res.statusCode).toBe(201);
    expect(res.body.user.email).toBe(registerData.email);
    expect(res.body.user.subscription).toBe("starter");

    const user = await User.findOne({ email: registerData.email });
    expect(user.email).toBe(registerData.email);
  });

  test("test register route with existing email", async () => {
    const registerData = {
      email: "test@gmail.com",
      password: "Test1234",
    };

    // Create a user with the same email address
    await User.create(registerData);

    const res = await request(app).post("/users/register").send(registerData);
    expect(res.statusCode).toBe(409);
    expect(res.body.message).toBe("Email in use");

    const user = await User.findOne({ email: registerData.email });
    expect(user.email).toBe(registerData.email);
  });
});

// Test the login flow

describe("test /users/login route", () => {
  let server = null;
  beforeAll(async () => {
    server = app.listen(PORT);
    await mongoose.connect(DB_HOST_TEST);
  });

  afterAll(async () => {
    server.close();
    await mongoose.connection.close();
  });

  afterEach(async () => {
    await User.deleteMany({});
  });

  test("should successfully log in with correct credentials", async () => {
    const loginData = {
      email: "test@gmail.com",
      password: "Test1234",
    };

    // Create a user with the loginData
    await User.create(loginData);

    const res = await request(app).post("/users/login").send(loginData);
    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeTruthy();
    expect(res.body.user.email).toBe(loginData.email);
    expect(res.body.user.subscription).toBe("starter");
  });

  test("should fail to log in with incorrect email", async () => {
    const loginData = {
      email: "test@gmail.com",
      password: "Test1234",
    };

    // Create a user with the loginData
    await User.create(loginData);

    const res = await request(app)
      .post("/users/login")
      .send({ email: "invalid@mail.com", password: loginData.password });
    expect(res.statusCode).toBe(401);
    expect(res.body.message).toBe("Email or password is wrong");
  });

  test("should fail to log in with incorrect password", async () => {
    const loginData = {
      email: "test@gmail.com",
      password: "Test1234",
    };

    // Create a user with the loginData
    await User.create(loginData);

    const res = await request(app)
      .post("/users/login")
      .send({ email: loginData.email, password: "test7626" });
    expect(res.statusCode).toBe(401);
    expect(res.body.message).toBe("Email or password is wrong");
  });

  test("should fail to log in with missing email", async () => {
    const loginData = {
      email: "test@gmail.com",
      password: "Test1234",
    };

    // Create a user with the loginData
    await User.create(loginData);

    const res = await request(app)
      .post("/users/login")
      .send({ password: loginData.password });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe('"email" is required');
  });

  test("should fail to log in with missing password", async () => {
    const loginData = {
      email: "test@gmail.com",
      password: "Test1234",
    };

    // Create a user with the loginData
    await User.create(loginData);

    const res = await request(app)
      .post("/users/login")
      .send({ email: loginData.email });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe('"password" is required');
  });
});

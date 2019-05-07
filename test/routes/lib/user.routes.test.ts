import { MockDataHelper } from "../../mock";
import request, { SuperTest, Test } from "supertest";

require("dotenv").config();

jest.setTimeout(30000);

describe("User Test", () => {
  let supertest: SuperTest<Test>, mh: MockDataHelper, token: string;
  const user = {
    _id: "5cbc14e49aea481b6ced7731",
    name: "leo",
    account_type: "saving",
    password: "12345",
    DateCreated: "2019-04-21T06:59:48.628Z",
    DateUpdated: "2019-04-21T06:59:48.628Z",
    __v: 0
  };

  const data = { user };

  beforeAll(async done => {
    mh = new MockDataHelper();
    supertest = await mh.connect();
    done();
  });

  beforeEach(async () => {
    token = await mh.getToken();
  });

  test("#POST - User without auth", async () => {
    const result = await supertest.post("/user").send({});

    expect(result.status).toEqual(403);
  });

  test("#POST - User with invalid auth", async () => {
    token = "test " + (await mh.getToken());
    const result = await supertest
      .post("/user")
      .set("Content-Type", "application/json")
      .set("Authorization", token)
      .send({});

    // console.log(result.status);
    // console.log(result.statusType);
    // console.log(result.error.text);
    expect(result.status).toEqual(400);
  });

  test("#POST - User with without body", async () => {
    token = await mh.getToken();
    const result = await supertest
      .post("/user")
      .set("Content-Type", "application/json")
      .set("Authorization", token)
      .send({});

    // console.log(result.error.text);
    expect(JSON.parse(result.error.text)).toEqual({
      message: "Body is empty!"
    });
  });

  test("#POST - User with without name", async () => {
    token = await mh.getToken();
    const result = await supertest
      .post("/user")
      .set("Content-Type", "application/json")
      .set("Authorization", token)
      .send({
        password: "pass1",
        account_type: "type1"
      });

    expect(JSON.parse(result.error.text)).toEqual({
      message: "Name is empty!"
    });
  });

  test("#GET - User w/o auth", async () => {
    const result = await supertest
      .get("/user")
      .set("Content-Type", "application/json")
      .send();

    expect(result.status).toEqual(403);
  });

  test("#POST - User", async () => {
    token = await mh.getToken();
    const result = await supertest
      .post("/user")
      .set("Content-Type", "application/json")
      .set("Authorization", token)
      .send({ ...data.user });

    expect(result.status).toEqual(200);
  });

  test("#POST - Another User", async () => {
    token = await mh.getToken();
    const result = await supertest
      .post("/user")
      .set("Content-Type", "application/json")
      .set("Authorization", token)
      .send({ ...data.user, _id: "5cbc14e49aea481b6ced7732" });

    expect(result.status).toEqual(200);
  });

  test("#LOGIN w/o body", async () => {
    const result = await supertest
      .post("/user/login")
      .set("Content-Type", "application/json")
      .send();

    expect(result.status).toEqual(400);
  });

  test("#LOGIN w/o name", async () => {
    const result = await supertest
      .post("/user/login")
      .set("Content-Type", "application/json")
      .send({ password: data.user.password });

    expect(result.body.message).toEqual("Name is empty!");
  });

  test("#LOGIN w/o password", async () => {
    const result = await supertest
      .post("/user/login")
      .set("Content-Type", "application/json")
      .send({ name: data.user.name });

    expect(result.body.message).toEqual("Password is empty!");
  });

  test("#LOGIN w/ incorrect credentials", async () => {
    const result = await supertest
      .post("/user/login")
      .set("Content-Type", "application/json")
      .send({ name: data.user.name, password: "123" });

    expect(result.body.message).toEqual("Incorrect credentials!");
  });

  test("#LOGIN w/ correct credentials", async () => {
    const result = await supertest
      .post("/user/login")
      .set("Content-Type", "application/json")
      .send({ name: data.user.name, password: data.user.password });

    const token = await mh.generateToken(data.user.name, data.user.password);
    expect(result.body.token).toEqual(token);
    expect(result.body.message).toEqual("Login user");
  });

  test("#GET - All Users", async () => {
    token = await mh.getToken();
    const result = await supertest
      .get("/user")
      .set("Content-Type", "application/json")
      .set("Authorization", token)
      .send();

    expect(result.body.length).toEqual(2);
    expect(result.body[0]).toEqual({ ...data.user });
  });

  test("#GET - One Users wrong ID", async () => {
    const id = "5cbc14e49aea481b6cedxxxx";
    token = await mh.getToken();
    const result = await supertest
      .get(`/user/${id}`)
      .set("Content-Type", "application/json")
      .set("Authorization", token)
      .send();

    expect(result.status).toEqual(403);
  });

  test("#GET - One Users", async () => {
    token = await mh.getToken();
    const result = await supertest
      .get(`/user/${data.user._id}`)
      .set("Content-Type", "application/json")
      .set("Authorization", token)
      .send();

    expect(result.body).toEqual({ ...data.user });
  });

  test("#Update - User", async () => {
    token = await mh.getToken();
    const testUser = { ...data.user, name: "Lionell" };
    const result = await supertest
      .patch(`/user/5cbc14e49aea481b6ced7731`)
      .set("Content-Type", "application/json")
      .set("Authorization", token)
      .send({ ...testUser });

    expect(result.body.data).toEqual({ ...testUser });
  });

  test("#Update - User not existing", async () => {
    token = await mh.getToken();
    const testUser = { ...data.user, name: "Lionell" };
    const result = await supertest
      .patch(`/user/5cbc14e49aea481b6cedxxxx`)
      .set("Content-Type", "application/json")
      .set("Authorization", token)
      .send({ ...testUser });

    expect(result.status).toEqual(403);
  });

  test("#POST - User with duplicate account", async () => {
    token = await mh.getToken();
    const result = await supertest
      .post("/user")
      .set("Content-Type", "application/json")
      .set("Authorization", token)
      .send({ ...data.user });

    expect(result.status).toEqual(400);
  });

  test("#Delete Account", async () => {
    token = await mh.getToken();
    const result = await supertest
      .delete(`/user/${data.user._id}`)
      .set("Content-Type", "application/json")
      .set("Authorization", token)
      .send();

    expect(result.status).toEqual(200);
  });

  test("#Delete non Existing Account", async () => {
    token = await mh.getToken();
    const result = await supertest
      .delete(`/user/5cbc14e49aea481b6ced9999`)
      .set("Content-Type", "application/json")
      .set("Authorization", token)
      .send();

    expect(result.status).toEqual(404);
  });

  test("#Delete another Account", async () => {
    token = await mh.getToken();
    const result = await supertest
      .delete(`/user/5cbc14e49aea481b6ced7732`)
      .set("Content-Type", "application/json")
      .set("Authorization", token)
      .send();

    expect(result.status).toEqual(200);
  });
});

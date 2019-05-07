import request, { SuperTest, Test } from "supertest";
import express, { Application } from "express";
import mongoose, { connect } from "mongoose";
import { Routes } from "../src/routes";
import jwt from "../src/middleware/jwt";
import config from "../src/helper/config";
import bodyParser from "body-parser";
// import bluebird from "bluebird";

// mongoose.Promise = bluebird;

export class MockDataHelper {
  constructor() {}

  async connect() {
    const app: Application = express();
    const connectionString = process.env.MONGO_URL_TEST || "";

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    const routes = new Routes(app);

    routes.setRoutes();

    app.set(
      "mongoConnection",
      connect(
        connectionString,
        { useNewUrlParser: true }
      )
    );

    return request(app);
  }

  async getToken(name?: string, password?: string): Promise<string> {
    return `Bearer ${await jwt.generateToken(
      { username: name || "user", password: password || "user" },
      config.SECRET,
      "30s"
    )}`;
  }

  async generateToken(name: string, password: string) {
    return await jwt.generateToken({ name, password }, config.SECRET);
  }
}

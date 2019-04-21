import express from "express";
import { connect, connection } from "mongoose";
import bodyParser from "body-parser";
import { Routes } from "./routes";

require("dotenv").config();

const app = express();
const port = process.env.PORT;
const connectionString = process.env.MONGO_URL || "";
const routes = new Routes(app);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

routes.setRoutes();

connect(
  connectionString,
  {
    useNewUrlParser: true
  }
)
  .then(() => {
    console.log("Success connect to DB");
    app.listen(port, () => {
      console.log("Listening to port " + port);
    });
  })
  .catch(() => {
    console.log("Error connecting to DB");
    process.exit();
  });

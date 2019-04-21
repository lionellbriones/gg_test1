import express from "express";
import bodyParser from "body-parser";
import {Routes} from "./routes";

require('dotenv').config();

const app = express();
const port = process.env.PORT;
const routes = new Routes(app);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

routes.setRoutes();

app.listen(port, () => {
    console.log("Listening at port " + port);
});
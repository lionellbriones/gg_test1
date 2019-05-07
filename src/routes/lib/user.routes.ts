import { Request, Response, Router } from "express";
import { User } from "../../model/lib/user.model";
import jwt from "../../middleware/jwt";
import config from "../../helper/config";

class UserRoutes {
  getUsers() {
    return (req: Request, res: Response) => {
      User.find()
        .then(data => {
          res.json(data);
        })
        .catch(err => {
          res.status(400).send({ message: err });
        });
    };
  }

  getUser() {
    return (req: Request, res: Response) => {
      const _id = req.params.id;
      User.findById(_id)
        .then(data => {
          res.json(data);
        })
        .catch(err => {
          if (err.message.includes("Cast to ObjectId failed")) {
            res.status(403).send({ message: `User with id ${_id} not found` });
          } else {
            res.status(400).send({ message: err });
          }
        });
    };
  }

  addUser() {
    return (req: Request, res: Response) => {
      if (typeof req.body === "undefined" || !Object.keys(req.body).length) {
        return res.status(400).send({ message: "Body is empty!" });
      } else if (typeof req.body.name === "undefined") {
        return res.status(400).send({ message: "Name is empty!" });
      } else if (typeof req.body.password === "undefined") {
        return res.status(400).send({ message: "Password is empty!" });
      } else if (typeof req.body.account_type === "undefined") {
        return res.status(400).send({ message: "Account type is empty!" });
      }

      const { name, account_type, password } = req.body;
      const user = new User({ ...req.body });

      user
        .save()
        .then(data => {
          res.json({
            data,
            message: "Added user"
          });
        })
        .catch(err => {
          res.status(400).send({ message: err });
        });
    };
  }

  updateUser() {
    return (req: Request, res: Response) => {
      const _id = req.params.id;
      const body = req.body;
      User.findByIdAndUpdate(_id, { ...body })
        .then(data => {
          const jsonData = JSON.parse(JSON.stringify(data));
          res.json({
            data: { ...jsonData, ...body },
            message: "Updated user"
          });
        })
        .catch(err => {
          if (err.message.includes("Cast to ObjectId failed")) {
            res.status(403).send({ message: `User with id ${_id} not found` });
          } else {
            res.status(400).send({ message: err });
          }
        });
    };
  }

  deleteUser() {
    return (req: Request, res: Response) => {
      const _id = req.params.id;
      User.findByIdAndRemove(_id)
        .then(data => {
          if (data === null) {
            res.status(404).send({ message: "ID not found" });
          } else {
            res.json({
              data,
              message: "Removed user"
            });
          }
        })
        .catch(err => {
          res.status(400).send({ message: err });
        });
    };
  }

  userLogin() {
    return (req: Request, res: Response) => {
      if (typeof req.body === "undefined" || !Object.keys(req.body).length) {
        return res.status(400).send({ message: "Body is empty!" });
      } else if (typeof req.body.name === "undefined") {
        return res.status(400).send({ message: "Name is empty!" });
      } else if (typeof req.body.password === "undefined") {
        return res.status(400).send({ message: "Password is empty!" });
      }

      const { name, password } = req.body;
      User.findOne({ name, password })
        .then(data => {
          if (data === null) {
            res.status(400).send({ message: "Incorrect credentials!" });
          } else {
            const token = jwt.generateToken({ name, password }, config.SECRET);
            res.json({
              token,
              message: "Login user"
            });
          }
        })
        .catch(err => {
          res.status(400).send({ message: err });
        });
    };
  }
}

const router = Router();
const userRoutes = new UserRoutes();

router
  .get("", jwt.verifyToken, userRoutes.getUsers())
  .get("/:id", jwt.verifyToken, userRoutes.getUser())
  .patch("/:id", jwt.verifyToken, userRoutes.updateUser())
  .delete("/:id", jwt.verifyToken, userRoutes.deleteUser())
  .post("", jwt.verifyToken, userRoutes.addUser())
  .post("/login", userRoutes.userLogin());

export const user = router;

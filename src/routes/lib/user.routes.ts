import { Request, Response, Router } from "express";
import { User } from "../../model/lib/user.model";

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
          res.status(400).send({ message: err });
        });
    };
  }

  addUser() {
    return (req: Request, res: Response) => {
      const { name, account_type } = req.body;
      const user = new User({
        name,
        account_type
      });

      user
        .save()
        .then(data => {
          console.log(data);

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
          res.json({
            data,
            message: "Updated user"
          });
        })
        .catch(err => {
          res.status(400).send({ message: err });
        });
    };
  }

  deleteUser() {
    return (req: Request, res: Response) => {
      const _id = req.params.id;
      User.findByIdAndRemove(_id)
        .then(data => {
          res.json({
            data,
            message: "Removed user"
          });
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
  .get("", userRoutes.getUsers())
  .get("/:id", userRoutes.getUser())
  .patch("/:id", userRoutes.updateUser())
  .delete("/:id", userRoutes.deleteUser())
  .post("", userRoutes.addUser());

export const user = router;

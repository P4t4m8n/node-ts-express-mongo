import { Request, Response } from "express";
import { userService } from "./user.service.js";
import { loggerService } from "../../services/logger.service.js";
import { UserFilter, UserModal } from "../../modal/user.modal.js";

export async function getUserById(req: Request, res: Response): Promise<void> {
  try {
    const user = await userService.getById(req.params._id);
    res.send(user);
  } catch (err) {
    loggerService.error("Failed to get user", err);
    res.status(500).send({ err: "Failed to get user" });
  }
}

export async function getUsers(req: Request, res: Response): Promise<void> {
  const filterBy: UserFilter = {
    txt: req.query?.txt?.toString() || "",
  };
  try {
    const users = await userService.query(filterBy);
    res.send(users);
  } catch (err) {
    loggerService.error("Failed to get users", err);
    res.status(500).send({ err: "Failed to get users" });
  }
}

export async function deleteUser(req: Request, res: Response): Promise<void> {
  try {
    await userService.remove(req.params.id);
    res.send({ msg: "Deleted successfully" });
  } catch (err) {
    loggerService.error("Failed to delete user", err);
    res.status(500).send({ err: "Failed to delete user" });
  }
}

export async function updateUser(req: Request, res: Response): Promise<void> {
  try {
    const userToSave: UserModal = {
      _id: req.body._id,
      fullname: req.body.fullname,
      username: req.body.username,
      password: req.body.password,
      email: req.body.email,
      imgUrl: req.body.imgUrl,
      createdAt: req.body.createdAt,
      isAdmin: req.body.isAdmin,
    };
    const savedUser = await userService.update(userToSave);
    res.send(savedUser);
  } catch (err) {
    loggerService.error("Failed to update user", err);
    res.status(500).send({ err: "Failed to update user" });
  }
}

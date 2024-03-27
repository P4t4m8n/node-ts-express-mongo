import { Request, Response } from "express";
import { loggerService } from "../../services/logger.service";
import { authService } from "./auth.service";

export async function login(req: Request, res: Response): Promise<void> {
  const { username, password } = req.body;
  try {
    const user = await authService.login(username, password);
    console.log("user:", user);
    const loginToken = authService.getLoginToken(user);

    loggerService.info("User login: ", user);
    res.cookie("loginToken", loginToken, { sameSite: "none", secure: true });

    res.json(user);
  } catch (err) {
    loggerService.error("Failed to Login " + err);
    res.status(401).send({ err: "Failed to Login" });
  }
}

export async function signup(req: Request, res: Response): Promise<void> {
  const userToAdd = {
    fullname: req.body.fullname,
    username: req.body.username,
    password: req.body.password,
    email: req.body.email,
    imgUrl: req.body.imgUrl,
    createdAt: req.body.createdAt,
  };
  try {
    const account = await authService.signup(userToAdd);
    loggerService.debug(
      `auth.route - new account created: ` + JSON.stringify(account)
    );

    const user = await authService.login(
      userToAdd.username,
      userToAdd.password
    );
    const loginToken = authService.getLoginToken(user);

    res.cookie("loginToken", loginToken);
    res.json(user);
  } catch (err) {
    loggerService.error("Failed to signup " + err);
    res.status(400).send({ err: "Failed to signup" });
  }
}

export async function logout(req: Request, res: Response): Promise<void> {
  try {
    res.clearCookie("loginToken");
    res.send({ msg: "Logged out successfully" });
  } catch (err) {
    res.status(500).send({ err: "Failed to logout" });
  }
}

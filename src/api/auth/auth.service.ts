import Cryptr from "cryptr";
import bcrypt from "bcrypt";
import { userService } from "../user/user.service.js";
import { loggerService } from "../../services/logger.service.js";
import { UserModal } from "../../modal/user.modal.js";

export const authService = {
  signup,
  login,
  getLoginToken,
  validateToken,
};

const cryptr = new Cryptr(process.env.SECRET1 || "i love mama");

async function login(username: string, password: string): Promise<UserModal> {
  loggerService.debug(`auth.service - login with username: ${username}`);

  const user = await userService.getByUsername(username);
  if (!user) throw new Error("Invalid username or password");
  if (!user.password) throw new Error("Invalid password");
  const match = bcrypt.compare(password, user.password);
  if (!match) throw new Error("Invalid username or password");

  delete user.password;
  return user;
}

async function signup(user: Partial<UserModal>): Promise<UserModal> {
  const { username, password } = user;
  const saltRounds = 10;

  loggerService.debug(`auth.service - signup with username: ${username}`);
  if (!username || !password) throw new Error("Missing details");

  const hash = await bcrypt.hash(password, saltRounds);
  return userService.add({
    ...user,
    password: hash,
  });
}

function getLoginToken(user: UserModal): string {
  const userInfo = {
    _id: user._id,
    username: user.username,
    isAdmin: user.isAdmin,
  };
  return cryptr.encrypt(JSON.stringify(userInfo));
}

function validateToken(loginToken: string): UserModal | null {
  try {
    const json = cryptr.decrypt(loginToken);
    const loggedinUser = JSON.parse(json);
    return loggedinUser;
  } catch (err) {
    console.log("Invalid login token");
  }
  return null;
}

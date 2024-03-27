var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import Cryptr from "cryptr";
import bcrypt from "bcrypt";
import { userService } from "../user/user.service.js";
import { loggerService } from "../../services/logger.service.js";
export const authService = {
    signup,
    login,
    getLoginToken,
    validateToken,
};
const cryptr = new Cryptr(process.env.SECRET1 || "i love mama");
function login(username, password) {
    return __awaiter(this, void 0, void 0, function* () {
        loggerService.debug(`auth.service - login with username: ${username}`);
        const user = yield userService.getByUsername(username);
        if (!user)
            throw new Error("Invalid username or password");
        const match = yield bcrypt.compare(password, user.password);
        if (!match)
            throw new Error("Invalid username or password");
        delete user.password;
        return user;
    });
}
function signup(user) {
    return __awaiter(this, void 0, void 0, function* () {
        const { username, password } = user;
        const saltRounds = 10;
        loggerService.debug(`auth.service - signup with username: ${username}`);
        if (!username || !password)
            throw new Error("Missing details");
        const hash = yield bcrypt.hash(password, saltRounds);
        return userService.add(Object.assign(Object.assign({}, user), { password: hash }));
    });
}
function getLoginToken(user) {
    const userInfo = {
        _id: user._id,
        username: user.username,
        isAdmin: user.isAdmin,
    };
    return cryptr.encrypt(JSON.stringify(userInfo));
}
function validateToken(loginToken) {
    try {
        const json = cryptr.decrypt(loginToken);
        const loggedinUser = JSON.parse(json);
        return loggedinUser;
    }
    catch (err) {
        console.log("Invalid login token");
    }
    return null;
}

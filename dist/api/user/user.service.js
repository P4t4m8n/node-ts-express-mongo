var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import mongodb from "mongodb";
import { dbService } from "../../services/db.service";
import { loggerService } from "../../services/logger.service";
const { ObjectId } = mongodb;
export const userService = {
    query,
    getById,
    getByUsername,
    remove,
    update,
    add,
};
function query(filterBy = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const criteria = _buildCriteria(filterBy);
        try {
            const collection = yield dbService.getCollection("user");
            const _users = yield collection
                .find(criteria)
                .sort({ nickname: -1 })
                .toArray();
            const users = _users.map((user) => {
                const fixedUser = {
                    _id: user._id,
                    fullname: user.fullname,
                    username: user.username,
                    email: user.email,
                    isAdmin: user.isAdmin,
                    createdAt: (user.createdAt = new ObjectId(user._id).getTimestamp()),
                    imgUrl: user.imgUrl,
                };
                return fixedUser;
            });
            return users;
        }
        catch (err) {
            loggerService.error("cannot find users", err);
            throw err;
        }
    });
}
function getById(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const collection = yield dbService.getCollection("user");
            const user = yield collection.findOne({ _id: new ObjectId(userId) });
            if (!user)
                throw new Error("Unable to find user");
            const fixedUser = {
                _id: user._id,
                fullname: user.fullname,
                username: user.username,
                email: user.email,
                isAdmin: user.isAdmin,
                createdAt: (user.createdAt = new ObjectId(user._id).getTimestamp()),
                imgUrl: user.imgUrl,
            };
            return fixedUser;
        }
        catch (err) {
            loggerService.error(`while finding user ${userId}`, err);
            throw err;
        }
    });
}
function getByUsername(username) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const collection = yield dbService.getCollection("user");
            const user = yield collection.findOne({ username });
            if (!user)
                throw new Error("Unable to find user");
            const fixedUser = {
                _id: user._id,
                fullname: user.fullname,
                username: user.username,
                email: user.email,
                isAdmin: user.isAdmin,
                createdAt: (user.createdAt = new ObjectId(user._id).getTimestamp()),
                imgUrl: user.imgUrl,
            };
            return fixedUser;
        }
        catch (err) {
            loggerService.error(`while finding user ${username}`, err);
            throw err;
        }
    });
}
function remove(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const collection = yield dbService.getCollection("user");
            yield collection.deleteOne({ _id: new ObjectId(userId) });
        }
        catch (err) {
            loggerService.error(`cannot remove user ${userId}`, err);
            throw err;
        }
    });
}
function update(user) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const userToSave = Object.assign(Object.assign({}, user), { _id: new ObjectId(user._id) });
            const collection = yield dbService.getCollection("user");
            yield collection.updateOne({ _id: userToSave._id }, { $set: userToSave });
            return userToSave;
        }
        catch (err) {
            loggerService.error(`cannot update user ${user._id}`, err);
            throw err;
        }
    });
}
function add(user) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const existUser = yield getByUsername(user.username);
            if (existUser)
                throw new Error("Username taken");
            const userToAdd = Object.assign({}, user);
            const collection = yield dbService.getCollection("user");
            yield collection.insertOne(userToAdd);
            return userToAdd;
        }
        catch (err) {
            loggerService.error("cannot insert user", err);
            throw err;
        }
    });
}
function _buildCriteria(filterBy) {
    const criteria = {};
    if (filterBy.txt) {
        const txtCriteria = { $regex: filterBy.txt, $options: "i" };
        criteria.$or = [
            {
                username: txtCriteria,
            },
            {
                fullname: txtCriteria,
            },
        ];
    }
    return criteria;
}

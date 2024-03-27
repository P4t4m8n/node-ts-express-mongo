import mongodb from "mongodb";
import { dbService } from "../../services/db.service";
import {
  QueryCriteria,
  TxtCriteria,
  UserFilter,
  UserModal,
} from "../../modal/user.modal";
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

async function query(filterBy: UserFilter = {}): Promise<UserModal[]> {
  const criteria = _buildCriteria(filterBy);

  try {
    const collection = await dbService.getCollection("user");

    const _users = await collection
      .find(criteria)
      .sort({ nickname: -1 })
      .toArray();

    const users = _users.map((user) => {
      const fixedUser: UserModal = {
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
  } catch (err) {
    loggerService.error("cannot find users", err);
    throw err;
  }
}

async function getById(userId: string) {
  try {
    const collection = await dbService.getCollection("user");
    const user = await collection.findOne({ _id: new ObjectId(userId) });

    if (!user) throw new Error("Unable to find user");
    const fixedUser: UserModal = {
      _id: user._id,
      fullname: user.fullname,
      username: user.username,
      email: user.email,
      isAdmin: user.isAdmin,
      createdAt: (user.createdAt = new ObjectId(user._id).getTimestamp()),
      imgUrl: user.imgUrl,
    };
    return fixedUser;
  } catch (err) {
    loggerService.error(`while finding user ${userId}`, err);
    throw err;
  }
}

async function getByUsername(username: string): Promise<UserModal> {
  try {
    const collection = await dbService.getCollection("user");
    const user = await collection.findOne({ username });
    if (!user) throw new Error("Unable to find user");

    const fixedUser: UserModal = {
      _id: user._id,
      fullname: user.fullname,
      username: user.username,
      email: user.email,
      isAdmin: user.isAdmin,
      createdAt: (user.createdAt = new ObjectId(user._id).getTimestamp()),
      imgUrl: user.imgUrl,
    };

    return fixedUser;
  } catch (err) {
    loggerService.error(`while finding user ${username}`, err);
    throw err;
  }
}

async function remove(userId: string): Promise<void> {
  try {
    const collection = await dbService.getCollection("user");
    await collection.deleteOne({ _id: new ObjectId(userId) });
  } catch (err) {
    loggerService.error(`cannot remove user ${userId}`, err);
    throw err;
  }
}

async function update(user: UserModal): Promise<UserModal> {
  try {
    const userToSave = { ...user, _id: new ObjectId(user._id) };

    const collection = await dbService.getCollection("user");
    await collection.updateOne({ _id: userToSave._id }, { $set: userToSave });
    return userToSave;
  } catch (err) {
    loggerService.error(`cannot update user ${user._id}`, err);
    throw err;
  }
}

async function add(user: Partial<UserModal>): Promise<UserModal> {
  const { username } = user;
  if (!username) throw new Error("user have no username");
  try {
    const existUser = await getByUsername(username);
    if (existUser) throw new Error("Username taken");
    const userToAdd = { ...user } as UserModal;
    const collection = await dbService.getCollection("user");
    await collection.insertOne(userToAdd);
    return userToAdd;
  } catch (err) {
    loggerService.error("cannot insert user", err);
    throw err;
  }
}

function _buildCriteria(filterBy: UserFilter): QueryCriteria {
  const criteria: QueryCriteria = {};
  if (filterBy.txt) {
    const txtCriteria: TxtCriteria = { $regex: filterBy.txt, $options: "i" };
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

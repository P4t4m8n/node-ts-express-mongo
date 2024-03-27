import { Hash } from "crypto";
import { ObjectId } from "mongodb";

export interface UserModal {
  _id: ObjectId;
  fullname: string;
  username: string;
  password?: string;
  email: string;
  imgUrl: string;
  createdAt: Date;
  isAdmin: boolean;
}

export interface UserFilter {
  txt: string;
}

export interface TxtCriteria {
  $regex: string;
  $options: string;
}

export interface QueryCriteria {
  $or?: Array<{ [key: string]: TxtCriteria }>;
}

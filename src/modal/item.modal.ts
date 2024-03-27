import { ObjectId } from "mongodb";

export interface ItemModal {
  _id?: ObjectId;
  name: string;
}

export interface ItemFilterModal {
  name?: string;
  
}

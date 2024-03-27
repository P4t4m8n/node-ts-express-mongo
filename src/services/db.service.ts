import { MongoClient, Db, Collection, Document } from "mongodb";
import { loggerService } from "./logger.service";
import { config } from "../config/index";

export const dbService = {
  getCollection,
};

let dbConn: Db | null = null;

async function getCollection(
  collectionName: string
): Promise<Collection<Document>> {
  try {
    const db = await _connect();
    const collection = db.collection<Document>(collectionName);
    return collection;
  } catch (err) {
    loggerService.error("Failed to get Mongo collection", err);
    throw err;
  }
}

async function _connect(): Promise<Db> {
  if (dbConn) return dbConn;
  try {
    const client = await MongoClient.connect(config.dbURL);
    const db = client.db(config.dbName);
    dbConn = db;
    return db;
  } catch (err) {
    loggerService.error("Cannot Connect to DB", err);
    throw err;
  }
}

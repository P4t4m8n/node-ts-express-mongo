import express from "express";

import { log } from "../../middlewares/logger.middleware.js";
import {
  addItem,
  getItemById,
  getItems,
  removeItem,
  updateItem,
} from "./item.controller.js";

export const itemRoutes = express.Router();

itemRoutes.get("/", log, getItems);
itemRoutes.get("/:stationId", log, getItemById);
itemRoutes.post("/edit", log, addItem);
itemRoutes.put("/edit/:stationId", log, updateItem);
itemRoutes.delete("/:stationId", log, removeItem);

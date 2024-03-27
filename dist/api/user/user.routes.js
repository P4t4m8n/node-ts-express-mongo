import express from "express";
import {
  deleteUser,
  getUserById,
  getUsers,
  updateUser,
} from "./user.controller.js";
import {
  requireAdmin,
  requireAuth,
} from "../../middlewares/requireAuth.middleware.js";

import { log } from "../../middlewares/logger.middleware.js";
export const userRoutes = express.Router();
userRoutes.get("/", log, requireAdmin, getUsers);
userRoutes.get("/:userId", log, requireAdmin, getUserById);
userRoutes.put("/edit/:userId", log, requireAuth, updateUser);
userRoutes.delete("/:userId", log, requireAuth, requireAdmin, deleteUser);

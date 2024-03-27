import { Request, Response } from "express";
import { loggerService } from "../services/logger.service.js";

export async function log(req: Request, res: Response, next: Function) {
  loggerService.info("Req was made", req.route.path);
  next();
}

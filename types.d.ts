
import { Request } from "express";
import { UserModal } from "./src/modal/user.modal";

// Extend the express Request interface with the loggedinUser property
declare module "express-serve-static-core" {
  interface Request {
    loggedinUser?: UserModal; 
  }
}

import { NextFunction, Request, Response } from "express";
import { asyncLocalStorage } from "../services/als.service.js";
import { authService } from "../api/auth/auth.service.js";
import { UserModal } from "../modal/user.modal";

interface IAsyncLocalStorageStore {
  loggedinUser?: UserModal;
}

export async function setupAsyncLocalStorage(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const storage: IAsyncLocalStorageStore = {};
  asyncLocalStorage.run(storage, () => {
    if (!req.cookies) return next();
    const loggedinUser = authService.validateToken(req.cookies.loginToken);

    if (loggedinUser) {
      const alsStore = asyncLocalStorage.getStore() as IAsyncLocalStorageStore;
      if (alsStore) {
        alsStore.loggedinUser = loggedinUser;
      }
    }
    next();
  });
}

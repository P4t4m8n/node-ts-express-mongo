import { asyncLocalStorage } from "../services/als.service.js";
import { authService } from "../api/auth/auth.service.js";
export async function setupAsyncLocalStorage(req, res, next) {
    const storage = {};
    asyncLocalStorage.run(storage, () => {
        if (!req.cookies)
            return next();
        const loggedinUser = authService.validateToken(req.cookies.loginToken);
        if (loggedinUser) {
            const alsStore = asyncLocalStorage.getStore();
            if (alsStore) {
                alsStore.loggedinUser = loggedinUser;
            }
        }
        next();
    });
}

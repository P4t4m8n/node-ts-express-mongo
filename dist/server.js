import express from "express";
import http from "http";
import cookieParser from "cookie-parser";
import path from "path";
import cors from "cors";
const app = express();
const server = http.createServer(app);
app.use(cookieParser());
app.use(express.json());
if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.resolve("public")));
}
else {
    const corsOptions = {
        origin: [
            "http://127.0.0.1:5173",
            "http://localhost:5173",
            "http://127.0.0.1:3000",
            "http://localhost:3000",
            "http://127.0.0.1:8080",
            "http://localhost:8080",
        ],
        credentials: true,
    };
    app.use(cors(corsOptions));
}
//Routes
import { authRoutes } from "./api/auth/auth.routes.js";
app.use("/api/auth", authRoutes);
import { userRoutes } from "./api/user/user.routes.js";
app.use("api/user", userRoutes);
import { loggerService } from "./services/logger.service.js";
app.get("/**", (req, res) => {
    res.sendFile(path.resolve("index.html"));
});
const port = process.env.PORT || 3030;
server.listen(port, () => {
    loggerService.info("Server is running on port: " + port);
});

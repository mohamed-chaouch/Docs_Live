import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import { verifyToken } from "./utils/verifyToken.js";
import cookieParser from "cookie-parser";
import { handleRefreshToken } from "./controllers/refreshTokenController.js";
import { handleLogout } from "./controllers/logoutController.js";
// routers
import userRouter from "./routes/userRouter.js";
import documentRouter from "./routes/documentRouter.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import "./config/connect.js";
import { createServer } from "http";
dotenv.config();
const app = express();
app.use(cors());
// Use Morgan with the custom format
app.use(morgan(":method :url :status"));
// for json Data
app.use(express.json({ limit: '10mb' }));
// app.use(express.json());
// for formData
app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded
// middleware for cookies
app.use(cookieParser());
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send("Something broke!");
});
app.use("/", userRouter);
app.use("/document", documentRouter);
// app.post('/refresh-token', refreshAccessToken);
app.post("/refresh-token", handleRefreshToken);
// Serve static files
const uploadsPath = path.join(__dirname, process.env.UPLOADS_PATH);
app.use("/", express.static(uploadsPath));
// app.use(verifyToken); // using the verifyToken for all the requests under this line
app.get("/logout", verifyToken, handleLogout);
const server = createServer(app);
const port = process.env.PORT || 4000;
server.listen(port, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});
export default server; // Make sure the server is exported for Vercel

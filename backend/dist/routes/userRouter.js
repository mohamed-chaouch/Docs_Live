import express from "express";
import upload from "../utils/multer.js";
import { verifyToken } from "../utils/verifyToken.js"; // Import the middleware
import { createUser, getUser, loginUser, getUsersByUserEmails } from "../controllers/userController.js";
const router = express.Router();
// Routes that do not require authentication
router.post("/create-user", upload.single("imageUrl"), createUser);
router.post("/login-user", loginUser);
// Apply authentication middleware to protected routes
router.get("/get-user/:id", verifyToken, getUser);
router.post("/get-users", verifyToken, getUsersByUserEmails);
export default router;

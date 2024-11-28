import { User } from "../models/User.js"; // Adjust the import based on the actual location of your User type
import { Multer } from "multer";
import { Request } from "express";


declare global {
  namespace Express {
    interface Request {
      user: User;
      file?: Multer.File; // For single file upload
      files?: Multer.File[]; // For multiple file uploads
    }
  }
}

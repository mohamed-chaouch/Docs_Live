import express from "express";
import { verifyToken } from "../utils/verifyToken.js"; // Import the middleware
import {
  createDocument,
  deleteDocument,
  getDocument,
  getDocumentsByUserEmail,
  getDocumentUsers,
  removeCollaborator,
  updateDocumentAccess,
  updateDocumentTitle,
} from "../controllers/documentController.js";

const router = express.Router();

// Routes that do not require authentication
router.post("/create-document/:userId/:email", verifyToken, createDocument);

router.get("/get-document/:userId/:roomId", getDocument);

router.put("/update-title-document/:roomId/:title", updateDocumentTitle);

router.get(
  "/get-documents-by-user/:email",
  verifyToken,
  getDocumentsByUserEmail
);

router.get(
  "/get-document-users/:roomId",
  getDocumentUsers
);

router.put("/update-document-access/:roomId/:email/:userType", updateDocumentAccess)

router.delete("/remove-collaborator/:roomId/:email",removeCollaborator);

router.delete("/delete-document/:roomId", verifyToken, deleteDocument);

export default router;

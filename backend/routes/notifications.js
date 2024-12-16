import express from "express";
import { getNotifications } from "../controllers/notificationsController.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

// Get Notifications
router.get("/", authMiddleware, getNotifications);

export default router;

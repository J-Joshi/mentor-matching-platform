import express from "express";
import { userDiscovery } from "../controllers/discoveryController.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

// User Discovery (Browse Profiles with Filters)
router.get("/", authMiddleware, userDiscovery);

export default router;

import express from "express";
import findMatches from "../controllers/matchmakingController.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

// Get Matches
router.get("/", authMiddleware, findMatches);

export default router;

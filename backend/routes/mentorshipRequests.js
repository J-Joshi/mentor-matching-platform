import express from "express";
import {
  sendRequest,
  getRequests,
  updateRequestStatus,
} from "../controllers/mentorshipRequestsController.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

// Send Request
router.post("/sendrequest", authMiddleware, sendRequest);

// Get Requests
router.get("/getrequest", authMiddleware, getRequests);

// Update Request Status
router.put("/updaterequest/:id", authMiddleware, updateRequestStatus);

export default router;

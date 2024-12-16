import express from "express";
import {
  checkProfileStatus,
  getProfile,
  updateProfile,
} from "../controllers/profileController.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

router.get("/checkprofilestatus", authMiddleware, checkProfileStatus);

router.get("/getprofile", authMiddleware, getProfile);

router.put("/updateprofile", authMiddleware, updateProfile);

export default router;

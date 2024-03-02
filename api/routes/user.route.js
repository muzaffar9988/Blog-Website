import express from "express";
import { test, updatedUser } from "../controllers/user.controller.js";
import { verifyToken } from "../utils/verifyUser.js";
const router = express.Router();

router.get("/test", test);
router.put("/update/:userId", verifyToken, updatedUser);

export default router;

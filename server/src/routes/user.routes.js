
import { Router } from "express";

import {
  registerUser,
  loginUser,
  logoutUser,
  forgotPassword,
  resetPassword,
} from "../controllers/user.controller.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

// Logout
router.post("/logout", logoutUser);

// Protected route example:
// router.get("/me", verifyJWT, getCurrentUser);

export default router;

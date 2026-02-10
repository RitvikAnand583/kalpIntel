import { Router } from "express";
import { register, verifyEmail, login, getMe, forgotPassword, resetPassword } from "../controllers/authController.js";
import authenticate from "../middlewares/auth.js";

const router = Router();

router.post("/register", register);
router.get("/verify-email/:token", verifyEmail);
router.post("/login", login);
router.get("/me", authenticate, getMe);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

export default router;

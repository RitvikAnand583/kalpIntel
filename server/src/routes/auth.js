import { Router } from "express";
import { register, verifyEmail, login, getMe } from "../controllers/authController.js";
import authenticate from "../middlewares/auth.js";

const router = Router();

router.post("/register", register);
router.get("/verify-email/:token", verifyEmail);
router.post("/login", login);
router.get("/me", authenticate, getMe);

export default router;

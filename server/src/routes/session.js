import { Router } from "express";
import { logout, logoutAll } from "../controllers/sessionController.js";
import authenticate from "../middlewares/auth.js";

const router = Router();

router.post("/logout", authenticate, logout);
router.post("/logout-all", authenticate, logoutAll);

export default router;

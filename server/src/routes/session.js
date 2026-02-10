import { Router } from "express";
import { logout, logoutAll, getSessions, revokeSession } from "../controllers/sessionController.js";
import authenticate from "../middlewares/auth.js";

const router = Router();

router.post("/logout", authenticate, logout);
router.post("/logout-all", authenticate, logoutAll);
router.get("/devices", authenticate, getSessions);
router.delete("/:sessionId", authenticate, revokeSession);

export default router;

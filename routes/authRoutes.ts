import { Router } from "express";
import { login, me, logout } from "../controllers/authController";
import authMiddleware from "../middlewares/authMiddleware";

const router = Router();

router.post("/login", login);
router.post("/logout", logout);
router.get("/me", authMiddleware, me);

export default router;

import { Router } from "express";
import { loginSchema, registerSchema } from "../validators/auth.validators";
import { validate } from "../../middleware/validations.middleware";
import { authMiddleware } from "../../middleware/auth.middleware";
import { AuthController } from "../controller/auth.controller";


const router = Router();
const authController = new AuthController();

// Public routes
router.post("/register", validate(registerSchema), (req, res) =>
authController.register(req, res)
);
router.post("/login", validate(loginSchema), (req, res) => authController.login(req, res));

// Protected routes
router.get("/me", authMiddleware, (req, res) => authController.getMe(req, res));
router.post("/logout", authMiddleware, (req, res) =>
  authController.logout(req, res)
);

export default router;

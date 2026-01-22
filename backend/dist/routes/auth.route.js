"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_validators_1 = require("../validators/auth.validators");
const validations_middleware_1 = require("../middleware/validations.middleware");
const auth_middleware_1 = require("../middleware/auth.middleware");
const auth_controller_1 = require("../controller/auth.controller");
const router = (0, express_1.Router)();
const authController = new auth_controller_1.AuthController();
// Public routes
router.post("/register", (0, validations_middleware_1.validate)(auth_validators_1.registerSchema), (req, res) => authController.register(req, res));
router.post("/login", (0, validations_middleware_1.validate)(auth_validators_1.loginSchema), (req, res) => authController.login(req, res));
// Protected routes
router.get("/me", auth_middleware_1.authMiddleware, (req, res) => authController.getMe(req, res));
router.post("/logout", auth_middleware_1.authMiddleware, (req, res) => authController.logout(req, res));
exports.default = router;

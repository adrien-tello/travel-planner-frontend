"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prefrences_controller_1 = require("../controller/prefrences.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
const preferenceController = new prefrences_controller_1.PreferenceController();
// All routes require authentication
router.use(auth_middleware_1.authMiddleware);
// POST /api/preferences - Create user preferences
router.post("/", preferenceController.createPreferences.bind(preferenceController));
// GET /api/preferences - Get user preferences
router.get("/", preferenceController.getPreferences.bind(preferenceController));
// PUT /api/preferences - Update user preferences
router.put("/", preferenceController.updatePreferences.bind(preferenceController));
// DELETE /api/preferences - Delete user preferences
router.delete("/", preferenceController.deletePreferences.bind(preferenceController));
exports.default = router;

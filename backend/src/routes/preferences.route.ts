import { Router } from "express";
import { PreferenceController } from "../controller/prefrences.controller";
import { authMiddleware } from "../../middleware/auth.middleware";

const router = Router();
const preferenceController = new PreferenceController();

// All routes require authentication
router.use(authMiddleware);

// POST /api/preferences - Create user preferences
router.post("/", preferenceController.createPreferences.bind(preferenceController));

// GET /api/preferences - Get user preferences
router.get("/", preferenceController.getPreferences.bind(preferenceController));

// PUT /api/preferences - Update user preferences
router.put("/", preferenceController.updatePreferences.bind(preferenceController));

// DELETE /api/preferences - Delete user preferences
router.delete("/", preferenceController.deletePreferences.bind(preferenceController));

export default router;
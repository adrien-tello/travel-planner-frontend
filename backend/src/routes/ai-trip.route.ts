import { Router } from "express";
import { AITripController } from "../controller/ai-trip.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();
const aiTripController = new AITripController();

// All routes require authentication
router.use(authMiddleware);

// GET /api/ai-trips/suggestions - Generate trip suggestions based on user preferences
router.get("/suggestions", aiTripController.generateTripSuggestions.bind(aiTripController));

export default router;
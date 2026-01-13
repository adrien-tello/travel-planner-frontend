import { Router } from "express";
import { ItineraryController } from "../controller/itinerary.controller";
import { authMiddleware } from "../../middleware/auth.middleware";

const router = Router();
const itineraryController = new ItineraryController();

// All routes require authentication
router.use(authMiddleware);

// POST /api/itinerary/generate - Generate detailed itinerary
router.post("/generate", itineraryController.generateDetailedItinerary.bind(itineraryController));

export default router;
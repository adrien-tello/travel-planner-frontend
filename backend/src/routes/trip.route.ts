import { Router } from "express";
import { TripController } from "../controller/trip.controller";
import { authMiddleware } from "../../middleware/auth.middleware";

const router = Router();
const tripController = new TripController();

// All routes require authentication
router.use(authMiddleware);

// POST /api/trips - Create trip
router.post("/", tripController.createTrip.bind(tripController));

// GET /api/trips - Get user trips
router.get("/", tripController.getUserTrips.bind(tripController));

// GET /api/trips/:id - Get single trip
router.get("/:id", tripController.getTrip.bind(tripController));

// PUT /api/trips/:id - Update trip
router.put("/:id", tripController.updateTrip.bind(tripController));

// DELETE /api/trips/:id - Delete trip
router.delete("/:id", tripController.deleteTrip.bind(tripController));

export default router;
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const trip_controller_1 = require("../controller/trip.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
const tripController = new trip_controller_1.TripController();
// All routes require authentication
router.use(auth_middleware_1.authMiddleware);
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
exports.default = router;

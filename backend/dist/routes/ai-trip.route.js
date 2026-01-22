"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ai_trip_controller_1 = require("../controller/ai-trip.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
const aiTripController = new ai_trip_controller_1.AITripController();
// All routes require authentication
router.use(auth_middleware_1.authMiddleware);
// GET /api/ai-trips/suggestions - Generate trip suggestions based on user preferences
router.get("/suggestions", aiTripController.generateTripSuggestions.bind(aiTripController));
exports.default = router;

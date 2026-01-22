"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const itinerary_controller_1 = require("../controller/itinerary.controller");
const router = (0, express_1.Router)();
const itineraryController = new itinerary_controller_1.ItineraryController();
router.post('/generate', itineraryController.generateItinerary);
exports.default = router;

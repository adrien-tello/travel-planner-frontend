"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AITripController = void 0;
const ai_trip_planner_service_1 = require("../service/ai-trip-planner.service");
const preferences_service_1 = require("../service/preferences.service");
const aiTripPlannerService = new ai_trip_planner_service_1.AITripPlannerService();
const preferenceService = new preferences_service_1.PreferenceService();
class AITripController {
    async generateTripSuggestions(req, res) {
        try {
            const userId = req.user.userId;
            // Get user preferences
            const preferences = await preferenceService.getUserPreferences(userId);
            const suggestions = await aiTripPlannerService.generateTripSuggestions(preferences);
            return res.status(200).json({
                success: true,
                message: "Trip suggestions generated successfully",
                data: suggestions,
            });
        }
        catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message || "Failed to generate trip suggestions",
            });
        }
    }
}
exports.AITripController = AITripController;

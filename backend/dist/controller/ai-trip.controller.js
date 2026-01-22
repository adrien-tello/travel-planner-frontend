"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AITripController = void 0;
const ai_trip_planner_service_1 = require("../service/ai-trip-planner.service");
const preferences_service_1 = require("../service/preferences.service");
const pexels_service_1 = require("../service/pexels.service");
const aiTripPlannerService = new ai_trip_planner_service_1.AITripPlannerService();
const preferenceService = new preferences_service_1.PreferenceService();
class AITripController {
    async generateTripSuggestions(req, res) {
        try {
            const userId = req.user.userId;
            // Get user preferences
            const preferences = await preferenceService.getUserPreferences(userId);
            const suggestions = await aiTripPlannerService.generateTripSuggestions(preferences);
            // Enrich suggestions with Pexels images
            const enrichedSuggestions = await Promise.all(suggestions.map(async (suggestion) => {
                try {
                    const photos = await pexels_service_1.PexelsService.searchImages(`${suggestion.destination} ${suggestion.country}`, 3);
                    return {
                        ...suggestion,
                        photos: photos.length > 0 ? photos : suggestion.images || []
                    };
                }
                catch (error) {
                    console.error(`Failed to fetch images for ${suggestion.destination}:`, error);
                    return {
                        ...suggestion,
                        photos: suggestion.images || []
                    };
                }
            }));
            return res.status(200).json({
                success: true,
                message: "Trip suggestions generated successfully",
                data: enrichedSuggestions,
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

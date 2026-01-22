import { Response } from "express";
import { AuthenticatedRequest } from "../types/express";
import { AITripPlannerService } from "../service/ai-trip-planner.service";
import { PreferenceService } from "../service/preferences.service";
import { PexelsService } from "../service/pexels.service";

const aiTripPlannerService = new AITripPlannerService();
const preferenceService = new PreferenceService();

export class AITripController {
  async generateTripSuggestions(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user!.userId;

      // Get user preferences
      const preferences = await preferenceService.getUserPreferences(userId);
      
      const suggestions = await aiTripPlannerService.generateTripSuggestions(preferences);

      // Enrich suggestions with Pexels images
      const enrichedSuggestions = await Promise.all(
        suggestions.map(async (suggestion: any) => {
          try {
            const photos = await PexelsService.searchImages(
              `${suggestion.destination} ${suggestion.country}`,
              3
            );
            return {
              ...suggestion,
              photos: photos.length > 0 ? photos : suggestion.images || []
            };
          } catch (error) {
            console.error(`Failed to fetch images for ${suggestion.destination}:`, error);
            return {
              ...suggestion,
              photos: suggestion.images || []
            };
          }
        })
      );

      return res.status(200).json({
        success: true,
        message: "Trip suggestions generated successfully",
        data: enrichedSuggestions,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message || "Failed to generate trip suggestions",
      });
    }
  }
}
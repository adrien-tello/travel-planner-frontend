import { Request, Response } from "express";
import { AITripPlannerService } from "../service/ai-trip-planner.service";
import { PreferenceService } from "../service/preferences.service";

const aiTripPlannerService = new AITripPlannerService();
const preferenceService = new PreferenceService();

export class AITripController {
  async generateTripSuggestions(req: Request, res: Response) {
    try {
      const userId = req.user!.userId;

      // Get user preferences
      const preferences = await preferenceService.getUserPreferences(userId);
      
      // Generate AI trip suggestions
      const suggestions = await aiTripPlannerService.generateTripSuggestions(preferences);

      return res.status(200).json({
        success: true,
        message: "Trip suggestions generated successfully",
        data: suggestions,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message || "Failed to generate trip suggestions",
      });
    }
  }
}
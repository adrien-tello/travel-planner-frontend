import { Request, Response } from "express";
import { ItineraryPlannerService } from "../service/itinerary-planner.service";
import { PreferenceService } from "../service/preferences.service";

const itineraryPlannerService = new ItineraryPlannerService();
const preferenceService = new PreferenceService();

export class ItineraryController {
  async generateDetailedItinerary(req: Request, res: Response) {
    try {
      const userId = req.user!.userId;
      const { destination, duration } = req.body;

      if (!destination || !duration) {
        return res.status(400).json({
          success: false,
          message: "Destination and duration are required",
        });
      }

      // Get user preferences
      const preferences = await preferenceService.getUserPreferences(userId);
      
      // Generate detailed itinerary
      const itinerary = await itineraryPlannerService.generateDetailedItinerary(
        destination,
        duration,
        preferences
      );

      return res.status(200).json({
        success: true,
        message: "Detailed itinerary generated successfully",
        data: itinerary,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message || "Failed to generate detailed itinerary",
      });
    }
  }
}
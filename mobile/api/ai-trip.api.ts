import { apiClient } from "./client.api";
import { ApiResponse } from "./types";

export interface TripSuggestion {
  id: string;
  destination: string;
  country: string;
  duration: number;
  estimatedBudget: number;
  highlights: string[];
  bestTimeToVisit: string;
  activities: string[];
  matchScore: number;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  hotels?: any[];
  photos?: string[];
  localAttractions?: any[];
}

export const aiTripApi = {
  // Get AI-generated trip suggestions based on user preferences
  getTripSuggestions: async (): Promise<TripSuggestion[]> => {
    const response = await apiClient.get<ApiResponse<TripSuggestion[]>>(
      "/ai-trips/suggestions"
    );
    return response.data.data!;
  },
};

export default aiTripApi;
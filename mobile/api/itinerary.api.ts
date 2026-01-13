import { apiClient } from "./client.api";
import { ApiResponse } from "./types";

export interface DetailedItinerary {
  id: string;
  destination: string;
  duration: number;
  totalBudget: number;
  days: DayItinerary[];
  hotels: Hotel[];
  flightInfo?: FlightInfo;
  travelTips: string[];
  destinationInfo?: DestinationInfo;
  photos?: string[];
  coverImage?: string;
  mapData?: MapData;
}

export interface DestinationInfo {
  description: string;
  bestTimeToVisit: string;
  climate: string;
  culture: string;
  language: string;
  currency: string;
  timeZone: string;
  attractions: string[];
  travelTips: string[];
}

export interface MapData {
  latitude: number;
  longitude: number;
  bounds: {
    northeast: { lat: number; lng: number };
    southwest: { lat: number; lng: number };
  };
}

export interface DayItinerary {
  day: number;
  date: string;
  theme: string;
  activities: Activity[];
  meals: Meal[];
  estimatedCost: number;
}

export interface Activity {
  time: string;
  name: string;
  description: string;
  location: string;
  duration: number;
  cost: number;
  photos: string[];
  type: 'attraction' | 'transport' | 'experience';
}

export interface Meal {
  time: string;
  restaurant: string;
  cuisine: string;
  cost: number;
  rating?: number;
  photos?: string[];
}

export interface Hotel {
  name: string;
  rating: number;
  pricePerNight: number;
  amenities: string[];
  photos: string[];
  location: string;
  placeId?: string;
}

export interface FlightInfo {
  departure: string;
  arrival: string;
  estimatedCost: number;
  duration: string;
}

export const itineraryApi = {
  // Generate detailed itinerary
  generateDetailedItinerary: async (destination: string, duration: number): Promise<DetailedItinerary> => {
    const response = await apiClient.post<ApiResponse<DetailedItinerary>>(
      "/itinerary/generate",
      { destination, duration }
    );
    return response.data.data!;
  },
};

export default itineraryApi;
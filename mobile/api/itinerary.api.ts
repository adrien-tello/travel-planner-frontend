import { apiClient } from "./client.api";
import { ApiResponse } from "./types";

export interface DetailedItinerary {
  id: string;
  destination: string;
  duration: number;
  travelers: number;
  budget?: number;
  budgetRange?: string;
  interests?: string[];
  about: string;
  coverImage?: string;
  images: string[];
  itinerary: DaySchedule[];
  totalVenues: number;
  summary?: {
    totalCost: number;
    accommodations: any[];
    highlights: string[];
    bestTimeToVisit: string;
    localCurrency: string;
    timeZone: string;
    weatherTips: string[];
    packingList: string[];
  };
  note?: string;
}

export interface DaySchedule {
  day: number;
  date: string;
  dayOfWeek: string;
  theme: string;
  schedule: ScheduleItem[];
  accommodation?: {
    name: string;
    rating: number;
    amenities: string[];
    priceRange: string;
  };
  estimatedCost: number;
  tips: string[];
  weather: string;
  transportation: string[];
}

export interface ScheduleItem {
  time: string;
  type: 'meal' | 'activity';
  title: string;
  venue: {
    name: string;
    rating?: number;
    priceRange?: string;
    description?: string;
    image?: string;
  };
  duration: number;
  description: string;
}

// Legacy interfaces for backward compatibility
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

export const itineraryApi = {
  // Generate detailed itinerary using the new backend format
  generateDetailedItinerary: async (options: { 
    destination: string; 
    duration: number; 
    travelers?: number; 
    budget?: number; 
    interests?: string[] 
  }): Promise<DetailedItinerary> => {
    // Parse destination
    const [city, country] = options.destination.split(',').map(s => s.trim());
    
    // Map budget to budget range
    let budgetRange: 'low' | 'mid' | 'high' = 'mid';
    if (options.budget && options.budget < 1000) budgetRange = 'low';
    else if (options.budget && options.budget > 3000) budgetRange = 'high';
    
    const requestData = {
      city: city || options.destination,
      country: country || 'Unknown',
      interests: options.interests || ['culture', 'food', 'sightseeing'],
      budgetRange,
      days: options.duration,
      travelers: options.travelers,
      budget: options.budget
    };

    const response = await apiClient.post<ApiResponse<DetailedItinerary>>(
      "/itinerary/generate",
      requestData
    );
    
    return response.data.data!;
  },
};

export default itineraryApi;
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export interface ItineraryRequest {
  city: string;
  country: string;
  interests: string[];
  budgetRange: 'low' | 'mid' | 'high';
  days: number;
  travelers?: number;
  budget?: number;
}

export interface ItineraryResponse {
  success: boolean;
  data: {
    id?: string;
    destination: string;
    duration: number;
    travelers: number;
    budget?: number;
    budgetRange?: string;
    interests?: string[];
    about: string;
    itinerary: DaySchedule[];
    totalVenues: number;
    images: string[];
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
  };
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
  };
  duration: number;
  description: string;
}

export const generateItinerary = async (params: {
  destination: string;
  startDate: string;
  endDate: string;
  numberOfTravelers: number;
  budget: number;
  preferences?: any;
}): Promise<any> => {
  // Parse destination
  const [city, country] = params.destination.split(',').map(s => s.trim());
  
  // Calculate days
  const startDate = new Date(params.startDate);
  const endDate = new Date(params.endDate);
  const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  
  // Map budget to budget range
  let budgetRange: 'low' | 'mid' | 'high' = 'mid';
  if (params.budget < 1000) budgetRange = 'low';
  else if (params.budget > 3000) budgetRange = 'high';
  
  // Default interests
  const interests = params.preferences?.interests || ['culture', 'food', 'sightseeing'];
  
  const requestData: ItineraryRequest = {
    city: city || params.destination,
    country: country || 'Unknown',
    interests,
    budgetRange,
    days,
    travelers: params.numberOfTravelers,
    budget: params.budget
  };

  const response = await fetch(`${API_BASE_URL}/itinerary/generate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestData),
  });

  if (!response.ok) {
    throw new Error(`Failed to generate itinerary: ${response.statusText}`);
  }

  const result: ItineraryResponse = await response.json();
  
  if (!result.success) {
    throw new Error(result.data?.about || 'Failed to generate itinerary');
  }

  // Transform backend response to frontend format
  return {
    id: result.data.id || Math.random().toString(36).substr(2, 9),
    userId: 'user-1',
    destination: result.data.destination,
    startDate: params.startDate,
    endDate: params.endDate,
    numberOfTravelers: params.numberOfTravelers,
    budget: params.budget,
    days: result.data.itinerary.map(day => ({
      date: day.date,
      events: day.schedule.map(item => ({
        id: `${day.day}-${item.time}-${item.type}`,
        title: item.title,
        startTime: item.time,
        endTime: addMinutes(item.time, item.duration),
        location: item.venue.name,
        category: item.type === 'meal' ? 'dining' : 'activity',
        budget: getBudgetFromPriceRange(item.venue.priceRange),
        description: item.description,
        venue: item.venue
      }))
    })),
    summary: result.data.summary,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};

function addMinutes(time: string, minutes: number): string {
  const [hours, mins] = time.split(':').map(Number);
  const date = new Date();
  date.setHours(hours, mins + minutes);
  return date.toTimeString().slice(0, 5);
}

function getBudgetFromPriceRange(priceRange?: string): number {
  const ranges = { '$': 15, '$$': 35, '$$$': 65, '$$$$': 120 };
  return ranges[priceRange as keyof typeof ranges] || 25;
}
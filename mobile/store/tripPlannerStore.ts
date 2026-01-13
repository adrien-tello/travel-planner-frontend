import { create } from "zustand"

export interface UserPreferences {
  budget: "budget" | "moderate" | "luxury"
  pace: "relaxed" | "moderate" | "fast"
  interests: string[]
  accommodation: "budget" | "mid-range" | "luxury"
  dining: "local" | "mixed" | "fine-dining"
}

export interface Location {
  latitude: number
  longitude: number
}

export interface Hotel {
  id: string
  name: string
  rating: number
  pricePerNight: number
  image: string
  location: Location
  amenities: string[]
  description: string
}

export interface Restaurant {
  id: string
  name: string
  cuisine: string
  rating: number
  priceRange: string
  image: string
  location: Location
  description: string
}

export interface Leisure {
  id: string
  name: string
  category: string
  rating: number
  price: number
  image: string
  location: Location
  description: string
  duration: string
}

export interface DailyItinerary {
  day: number
  date: string
  activities: Leisure[]
  restaurants: Restaurant[]
  notes: string
}

export interface TripPlan {
  id: string
  destination: string
  startDate: string
  endDate: string
  preferences: UserPreferences
  hotels: Hotel[]
  restaurants: Restaurant[]
  leisureActivities: Leisure[]
  dailyItinerary: DailyItinerary[]
  estimatedBudget: number
  personalizationScore: number
  aiSuggestions: string[]
}

interface TripPlannerStore {
  currentPlan: TripPlan | null
  userPreferences: UserPreferences | null
  isGenerating: boolean
  setUserPreferences: (preferences: UserPreferences) => void
  generateTripPlan: (destination: string, startDate: string, endDate: string) => Promise<void>
  clearPlan: () => void
}

export const useTripPlannerStore = create<TripPlannerStore>((set, get) => ({
  currentPlan: null,
  userPreferences: null,
  isGenerating: false,

  setUserPreferences: (preferences) => {
    set({ userPreferences: preferences })
  },

  generateTripPlan: async (destination, startDate, endDate) => {
    set({ isGenerating: true })
    
    // Simulate AI generation with mock data
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const preferences = get().userPreferences!
    
    const mockPlan: TripPlan = {
      id: Date.now().toString(),
      destination,
      startDate,
      endDate,
      preferences,
      hotels: generateMockHotels(destination, preferences),
      restaurants: generateMockRestaurants(destination, preferences),
      leisureActivities: generateMockLeisure(destination, preferences),
      dailyItinerary: generateMockItinerary(startDate, endDate),
      estimatedBudget: calculateEstimatedBudget(preferences),
      personalizationScore: 95,
      aiSuggestions: [
        "Based on your preferences, we've prioritized cultural experiences",
        "Weather forecast looks great for outdoor activities",
        "We found deals on accommodations matching your budget"
      ]
    }
    
    set({ currentPlan: mockPlan, isGenerating: false })
  },

  clearPlan: () => {
    set({ currentPlan: null })
  }
}))

// Mock data generators
function generateMockHotels(destination: string, preferences: UserPreferences): Hotel[] {
  const basePrice = preferences.accommodation === "budget" ? 80 : 
                   preferences.accommodation === "mid-range" ? 150 : 300
  
  return [
    {
      id: "h1",
      name: `Grand ${destination} Hotel`,
      rating: 4.5,
      pricePerNight: basePrice,
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400",
      location: { latitude: 40.7128, longitude: -74.0060 },
      amenities: ["Free WiFi", "Pool", "Gym", "Restaurant"],
      description: "Luxurious hotel in the heart of the city"
    },
    {
      id: "h2",
      name: `${destination} Boutique Inn`,
      rating: 4.8,
      pricePerNight: basePrice + 50,
      image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400",
      location: { latitude: 40.7180, longitude: -74.0100 },
      amenities: ["Free WiFi", "Breakfast", "Spa"],
      description: "Charming boutique hotel with personalized service"
    }
  ]
}

function generateMockRestaurants(destination: string, preferences: UserPreferences): Restaurant[] {
  return [
    {
      id: "r1",
      name: `${destination} Culinary House`,
      cuisine: "International",
      rating: 4.7,
      priceRange: preferences.dining === "local" ? "$" : preferences.dining === "mixed" ? "$$" : "$$$",
      image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400",
      location: { latitude: 40.7150, longitude: -74.0080 },
      description: "Fine dining with local ingredients"
    },
    {
      id: "r2",
      name: "Local Flavors Bistro",
      cuisine: "Local",
      rating: 4.5,
      priceRange: "$$",
      image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400",
      location: { latitude: 40.7200, longitude: -74.0050 },
      description: "Authentic local cuisine in cozy atmosphere"
    }
  ]
}

function generateMockLeisure(destination: string, preferences: UserPreferences): Leisure[] {
  return [
    {
      id: "l1",
      name: `${destination} Museum`,
      category: "Culture",
      rating: 4.6,
      price: 25,
      image: "https://images.unsplash.com/photo-1566127444979-b3d2b654e3c6?w=400",
      location: { latitude: 40.7100, longitude: -74.0120 },
      description: "World-class museum with extensive collections",
      duration: "3-4 hours"
    },
    {
      id: "l2",
      name: "City Walking Tour",
      category: "Adventure",
      rating: 4.8,
      price: 35,
      image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=400",
      location: { latitude: 40.7160, longitude: -74.0090 },
      description: "Guided walking tour of historic landmarks",
      duration: "2-3 hours"
    }
  ]
}

function generateMockItinerary(startDate: string, endDate: string): DailyItinerary[] {
  return [
    {
      day: 1,
      date: startDate,
      activities: [],
      restaurants: [],
      notes: "Arrival day - settle in and explore nearby area"
    }
  ]
}

function calculateEstimatedBudget(preferences: UserPreferences): number {
  const baseAmount = preferences.budget === "budget" ? 500 : 
                    preferences.budget === "moderate" ? 1500 : 3500
  return baseAmount
}
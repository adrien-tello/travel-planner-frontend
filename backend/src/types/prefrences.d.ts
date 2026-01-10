export interface UserPreferences {
  // Travel Style
  travelStyle: 'relaxed' | 'moderate' | 'packed'
  
  // Budget Range
  budgetRange: 'low' | 'mid' | 'high'
  budgetAmount?: {
    min: number
    max: number
    currency: string
  }
  
  // Interests & Activities
  interests: TravelInterest[]
  
  // Accommodation
  accommodation: {
    type: AccommodationType[]
    rating: number // 1-5 stars minimum
    amenities: string[]
  }
  
  // Food & Dining
  dining: {
    cuisineTypes: string[]
    dietaryRestrictions: DietaryRestriction[]
    priceRange: 'budget' | 'mid' | 'fine'
  }
  
  // Transportation
  transportation: {
    preferred: TransportationType[]
    accessibility: boolean
  }
  
  // Trip Planning
  planning: {
    advanceBooking: number // days in advance
    flexibility: 'rigid' | 'flexible' | 'very_flexible'
    groupSize: number
    travelWithKids: boolean
  }
  
  // Notifications
  notifications: {
    deals: boolean
    recommendations: boolean
    reminders: boolean
    weather: boolean
  }
  
  // Accessibility
  accessibility: {
    mobilityAssistance: boolean
    visualImpairment: boolean
    hearingImpairment: boolean
    other: string[]
  }
}

export type TravelInterest = 
  | 'culture'
  | 'history'
  | 'art'
  | 'museums'
  | 'food'
  | 'nightlife'
  | 'shopping'
  | 'nature'
  | 'adventure'
  | 'sports'
  | 'beach'
  | 'mountains'
  | 'photography'
  | 'architecture'
  | 'festivals'
  | 'wellness'
  | 'family'
  | 'romance'
  | 'business'

export type AccommodationType =
  | 'hotel'
  | 'resort'
  | 'hostel'
  | 'apartment'
  | 'villa'
  | 'boutique'
  | 'luxury'
  | 'budget'

export type DietaryRestriction =
  | 'vegetarian'
  | 'vegan'
  | 'gluten_free'
  | 'halal'
  | 'kosher'
  | 'dairy_free'
  | 'nut_free'
  | 'low_carb'
  | 'keto'

export type TransportationType =
  | 'walking'
  | 'public_transport'
  | 'taxi'
  | 'rental_car'
  | 'bike'
  | 'scooter'
  | 'tour_bus'

export interface PreferenceUpdate {
  userId: string
  preferences: Partial<UserPreferences>
  updatedAt: Date
}

export interface OnboardingPreferences {
  travelStyle: UserPreferences['travelStyle']
  budgetRange: UserPreferences['budgetRange']
  interests: TravelInterest[]
  groupSize: number
  travelWithKids: boolean
}
import { TravelInterest } from './prefrences'
import { ItineraryDay } from './itinerary'

export interface AIItineraryRequest {
  destination: string
  startDate: Date
  endDate: Date
  budget: number
  budgetRange: 'LOW' | 'MID' | 'HIGH'
  travelers: number
  travelStyle: 'RELAXED' | 'MODERATE' | 'PACKED'
  interests: TravelInterest[]
  customRequests?: string[]
  avoidPlaces?: string[]
}

export interface AIItineraryResponse {
  itinerary: {
    title: string
    description: string
    days: AIGeneratedDay[]
    estimatedCost: number
    tips: string[]
    warnings?: string[]
  }
  confidence: number
  alternatives?: {
    title: string
    description: string
    estimatedCost: number
  }[]
}

export interface AIGeneratedDay {
  dayNumber: number
  date: Date
  title: string
  description?: string
  places: AIGeneratedPlace[]
  estimatedCost: number
  walkingDistance?: number
  tips?: string[]
}

export interface AIGeneratedPlace {
  name: string
  type: 'HOTEL' | 'RESTAURANT' | 'ATTRACTION' | 'ACTIVITY' | 'TRANSPORT'
  description: string
  address?: string
  coordinates?: {
    latitude: number
    longitude: number
  }
  startTime?: string
  endTime?: string
  duration?: number
  estimatedCost?: number
  rating?: number
  tags: string[]
  bookingRequired?: boolean
  tips?: string[]
  alternatives?: string[]
}

export interface AIRecommendationRequest {
  userId: string
  destinationId?: string
  currentItineraryId?: string
  preferences?: {
    interests: TravelInterest[]
    budget: 'LOW' | 'MID' | 'HIGH'
    travelStyle: 'RELAXED' | 'MODERATE' | 'PACKED'
  }
}

export interface AIRecommendationResponse {
  recommendations: {
    destinations?: AIDestinationRecommendation[]
    places?: AIPlaceRecommendation[]
    activities?: AIActivityRecommendation[]
  }
  reasoning: string
  confidence: number
}

export interface AIDestinationRecommendation {
  destinationId: string
  name: string
  country: string
  imageUrl?: string
  matchScore: number
  reasons: string[]
  bestTime: string
  estimatedBudget: {
    min: number
    max: number
    currency: string
  }
}

export interface AIPlaceRecommendation {
  placeId: string
  name: string
  type: string
  matchScore: number
  reasons: string[]
  estimatedCost?: number
  timeToSpend?: number
}

export interface AIActivityRecommendation {
  name: string
  description: string
  type: string
  matchScore: number
  reasons: string[]
  duration?: number
  estimatedCost?: number
  bestTime?: string
}

export interface AIOptimizationRequest {
  itineraryId: string
  optimizeFor: 'time' | 'cost' | 'distance' | 'experience'
  constraints?: {
    maxWalkingDistance?: number
    mustVisitPlaces?: string[]
    avoidRushHours?: boolean
  }
}

export interface AIOptimizationResponse {
  optimizedItinerary: ItineraryDay[]
  improvements: {
    timeSaved?: number
    costSaved?: number
    distanceReduced?: number
    experienceScore?: number
  }
  changes: string[]
  confidence: number
}
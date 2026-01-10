import { Place } from './destination'
import { TravelInterest } from './prefrences'

export interface Itinerary {
  id: string
  userId: string
  destinationId: string
  title: string
  description?: string
  startDate: Date
  endDate: Date
  budget?: number
  budgetRange?: 'LOW' | 'MID' | 'HIGH'
  travelers: number
  travelStyle?: 'RELAXED' | 'MODERATE' | 'PACKED'
  interests: TravelInterest[]
  status: ItineraryStatus
  aiGenerated: boolean
  createdAt: Date
  updatedAt: Date
}

export type ItineraryStatus = 'DRAFT' | 'ACTIVE' | 'COMPLETED' | 'ARCHIVED'

export interface ItineraryDay {
  id: string
  itineraryId: string
  dayNumber: number
  date: Date
  title?: string
  description?: string
  places: ItineraryPlace[]
  createdAt: Date
  updatedAt: Date
}

export interface ItineraryPlace {
  id: string
  itineraryId: string
  dayId?: string
  placeId: string
  place: Place
  order: number
  startTime?: string
  endTime?: string
  duration?: number
  notes?: string
  isOptional: boolean
  createdAt: Date
  updatedAt: Date
}

export interface ItineraryWithDetails extends Itinerary {
  destination: {
    id: string
    name: string
    country: string
    imageUrl?: string
  }
  days: ItineraryDay[]
  totalPlaces: number
  estimatedCost?: number
}

export interface CreateItineraryRequest {
  destinationId: string
  title?: string
  startDate: Date
  endDate: Date
  budget?: number
  budgetRange: 'LOW' | 'MID' | 'HIGH'
  travelers: number
  travelStyle: 'RELAXED' | 'MODERATE' | 'PACKED'
  interests: TravelInterest[]
}

export interface GenerateItineraryRequest extends CreateItineraryRequest {
  useAI: boolean
  customRequests?: string[]
}

export interface UpdateItineraryRequest {
  title?: string
  description?: string
  startDate?: Date
  endDate?: Date
  budget?: number
  status?: ItineraryStatus
}

export interface AddPlaceToItineraryRequest {
  placeId: string
  dayId?: string
  startTime?: string
  endTime?: string
  notes?: string
  isOptional?: boolean
}

export interface UpdateItineraryPlaceRequest {
  order?: number
  startTime?: string
  endTime?: string
  notes?: string
  isOptional?: boolean
}

export interface ItineraryStats {
  totalItineraries: number
  activeItineraries: number
  completedItineraries: number
  totalDestinations: number
  averageTripLength: number
}
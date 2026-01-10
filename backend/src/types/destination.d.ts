export interface Destination {
  id: string
  name: string
  country: string
  city?: string
  latitude: number
  longitude: number
  description?: string
  imageUrl?: string
  currency?: string
  timezone?: string
  bestTime?: string
  avgBudget?: BudgetRange
  tags: string[]
  createdAt: Date
  updatedAt: Date
}

export interface BudgetRange {
  low: { min: number; max: number }
  mid: { min: number; max: number }
  high: { min: number; max: number }
  currency: string
}

export interface DestinationWithStats extends Destination {
  totalReviews: number
  averageRating: number
  popularPlaces: Place[]
  isFavorite?: boolean
}

export interface Place {
  id: string
  name: string
  type: PlaceType
  destinationId: string
  address?: string
  latitude?: number
  longitude?: number
  description?: string
  imageUrl?: string
  rating?: number
  priceRange?: string
  website?: string
  phone?: string
  openingHours?: OpeningHours
  amenities: string[]
  tags: string[]
  createdAt: Date
  updatedAt: Date
}

export type PlaceType = 
  | 'HOTEL'
  | 'RESTAURANT' 
  | 'ATTRACTION'
  | 'ACTIVITY'
  | 'TRANSPORT'
  | 'SHOPPING'

export interface OpeningHours {
  monday?: string
  tuesday?: string
  wednesday?: string
  thursday?: string
  friday?: string
  saturday?: string
  sunday?: string
}

export interface SearchDestinationsRequest {
  query?: string
  country?: string
  tags?: string[]
  budget?: 'low' | 'mid' | 'high'
  limit?: number
  offset?: number
}

export interface SearchDestinationsResponse {
  destinations: DestinationWithStats[]
  total: number
  hasMore: boolean
}
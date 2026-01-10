export interface Review {
  id: string
  userId: string
  destinationId?: string
  placeId?: string
  rating: number
  title?: string
  content?: string
  images: string[]
  helpful: number
  createdAt: Date
  updatedAt: Date
}

export interface ReviewWithUser extends Review {
  user: {
    id: string
    firstName?: string
    lastName?: string
    avatar?: string
  }
  destination?: {
    id: string
    name: string
    country: string
  }
  place?: {
    id: string
    name: string
    type: string
  }
}

export interface CreateReviewRequest {
  destinationId?: string
  placeId?: string
  rating: number
  title?: string
  content?: string
  images?: string[]
}

export interface UpdateReviewRequest {
  rating?: number
  title?: string
  content?: string
  images?: string[]
}

export interface ReviewStats {
  totalReviews: number
  averageRating: number
  ratingDistribution: {
    1: number
    2: number
    3: number
    4: number
    5: number
  }
}

export interface GetReviewsRequest {
  destinationId?: string
  placeId?: string
  userId?: string
  rating?: number
  limit?: number
  offset?: number
  sortBy?: 'newest' | 'oldest' | 'rating_high' | 'rating_low' | 'helpful'
}

export interface GetReviewsResponse {
  reviews: ReviewWithUser[]
  total: number
  stats: ReviewStats
  hasMore: boolean
}
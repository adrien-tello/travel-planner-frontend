import { apiClient } from "./client.api";
import { ApiResponse } from "./types";

export interface ItinerarySuggestion {
  id: string;
  destination: string;
  duration: number;
  budget?: number;
  interests: string[];
  description: string;
  coverImage?: string;
  popularity: number;
}

export interface ItinerarySearchResult {
  suggestions: ItinerarySuggestion[];
  total: number;
}

export const itinerarySearchApi = {
  // Search for itinerary suggestions
  searchItineraries: async (query: string): Promise<ItinerarySuggestion[]> => {
    try {
      // For now, return mock suggestions based on query
      return getMockSuggestions(query);
    } catch (error) {
      console.error('Itinerary search error:', error);
      return [];
    }
  },

  // Get popular destinations for suggestions
  getPopularDestinations: async (): Promise<ItinerarySuggestion[]> => {
    return [
      {
        id: 'paris-france',
        destination: 'Paris, France',
        duration: 5,
        budget: 2500,
        interests: ['culture', 'food', 'art'],
        description: 'Romantic city with iconic landmarks and world-class cuisine',
        coverImage: 'https://images.pexels.com/photos/338515/pexels-photo-338515.jpeg?auto=compress&cs=tinysrgb&w=400',
        popularity: 95
      },
      {
        id: 'tokyo-japan',
        destination: 'Tokyo, Japan',
        duration: 7,
        budget: 3200,
        interests: ['culture', 'food', 'technology'],
        description: 'Modern metropolis blending tradition with cutting-edge innovation',
        coverImage: 'https://images.pexels.com/photos/248195/pexels-photo-248195.jpeg?auto=compress&cs=tinysrgb&w=400',
        popularity: 92
      },
      {
        id: 'new-york-usa',
        destination: 'New York, USA',
        duration: 4,
        budget: 2800,
        interests: ['culture', 'shopping', 'entertainment'],
        description: 'The city that never sleeps with endless attractions',
        coverImage: 'https://images.pexels.com/photos/290386/pexels-photo-290386.jpeg?auto=compress&cs=tinysrgb&w=400',
        popularity: 90
      },
      {
        id: 'london-uk',
        destination: 'London, UK',
        duration: 6,
        budget: 2200,
        interests: ['culture', 'history', 'art'],
        description: 'Historic capital with royal palaces and world-class museums',
        coverImage: 'https://images.pexels.com/photos/460672/pexels-photo-460672.jpeg?auto=compress&cs=tinysrgb&w=400',
        popularity: 88
      }
    ];
  }
};

function getMockSuggestions(query: string): ItinerarySuggestion[] {
  const allDestinations = [
    {
      id: 'paris-france',
      destination: 'Paris, France',
      duration: 5,
      budget: 2500,
      interests: ['culture', 'food', 'art'],
      description: 'Romantic city with iconic landmarks and world-class cuisine',
      coverImage: 'https://images.pexels.com/photos/338515/pexels-photo-338515.jpeg?auto=compress&cs=tinysrgb&w=400',
      popularity: 95
    },
    {
      id: 'tokyo-japan',
      destination: 'Tokyo, Japan',
      duration: 7,
      budget: 3200,
      interests: ['culture', 'food', 'technology'],
      description: 'Modern metropolis blending tradition with cutting-edge innovation',
      coverImage: 'https://images.pexels.com/photos/248195/pexels-photo-248195.jpeg?auto=compress&cs=tinysrgb&w=400',
      popularity: 92
    },
    {
      id: 'rome-italy',
      destination: 'Rome, Italy',
      duration: 5,
      budget: 2000,
      interests: ['history', 'culture', 'food'],
      description: 'Eternal city with ancient ruins and incredible cuisine',
      coverImage: 'https://images.pexels.com/photos/2064827/pexels-photo-2064827.jpeg?auto=compress&cs=tinysrgb&w=400',
      popularity: 87
    },
    {
      id: 'barcelona-spain',
      destination: 'Barcelona, Spain',
      duration: 4,
      budget: 1800,
      interests: ['culture', 'art', 'beach'],
      description: 'Vibrant city with stunning architecture and Mediterranean charm',
      coverImage: 'https://images.pexels.com/photos/1388030/pexels-photo-1388030.jpeg?auto=compress&cs=tinysrgb&w=400',
      popularity: 85
    },
    {
      id: 'bali-indonesia',
      destination: 'Bali, Indonesia',
      duration: 8,
      budget: 1500,
      interests: ['nature', 'relaxation', 'culture'],
      description: 'Tropical paradise with temples, beaches, and rice terraces',
      coverImage: 'https://images.pexels.com/photos/2474690/pexels-photo-2474690.jpeg?auto=compress&cs=tinysrgb&w=400',
      popularity: 83
    }
  ];

  if (!query || query.length < 2) {
    return allDestinations.slice(0, 4);
  }

  const lowerQuery = query.toLowerCase();
  return allDestinations.filter(dest => 
    dest.destination.toLowerCase().includes(lowerQuery) ||
    dest.interests.some(interest => interest.toLowerCase().includes(lowerQuery)) ||
    dest.description.toLowerCase().includes(lowerQuery)
  );
}
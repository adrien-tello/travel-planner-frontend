import { apiClient } from './client.api';

export interface Hotel {
  id: string;
  name: string;
  rating: number;
  pricePerNight: number;
  amenities: string[];
  photos: string[];
  location: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  placeId: string;
}

export interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  rating: number;
  priceRange: string;
  photos: string[];
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  placeId: string;
}

export interface Activity {
  id: string;
  name: string;
  description: string;
  category: string;
  rating: number;
  price: number;
  duration: string;
  photos: string[];
  coordinates: {
    lat: number;
    lng: number;
  };
  placeId: string;
}

export const placesApi = {
  getHotels: async (destination: string, budgetRange?: string): Promise<Hotel[]> => {
    const params = new URLSearchParams({ destination });
    if (budgetRange) params.append('budgetRange', budgetRange);
    
    const response = await apiClient.get(`/places/hotels?${params.toString()}`);
    return response.data.hotels;
  },

  getRestaurants: async (destination: string, budgetRange?: string, cuisine?: string): Promise<Restaurant[]> => {
    const params = new URLSearchParams({ destination });
    if (budgetRange) params.append('budgetRange', budgetRange);
    if (cuisine) params.append('cuisine', cuisine);
    
    const response = await apiClient.get(`/places/restaurants?${params.toString()}`);
    return response.data.restaurants;
  },

  getActivities: async (destination: string, budgetRange?: string, interests?: string[]): Promise<Activity[]> => {
    const params = new URLSearchParams({ destination });
    if (budgetRange) params.append('budgetRange', budgetRange);
    if (interests && interests.length > 0) params.append('interests', interests.join(','));
    
    const response = await apiClient.get(`/places/activities?${params.toString()}`);
    return response.data.activities;
  },
};

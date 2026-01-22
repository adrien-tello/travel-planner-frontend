import { useMutation, useQuery } from '@tanstack/react-query';
import { apiClient } from './client.api';

// Types
export interface PlaceSyncRequest {
  destinationId: string;
  latitude: number;
  longitude: number;
  interests?: string[];
  budgetRange?: 'low' | 'mid' | 'high';
  placeTypes?: string[];
}

export interface TripPlanRequest {
  destinationId: string;
  startDate: string;
  endDate: string;
  budget: number;
  travelers: number;
  interests: string[];
  travelStyle: 'RELAXED' | 'MODERATE' | 'PACKED';
  budgetRange: 'low' | 'mid' | 'high';
}

export interface MapData {
  center: [number, number];
  zoom: number;
  markers: any[];
  routes: any[];
  bounds: {
    sw: [number, number];
    ne: [number, number];
  };
}

// Hooks
export const useTripadvisorPlaces = (destinationId: string, placeTypes?: string[]) => {
  return useQuery({
    queryKey: ['tripadvisor-places', destinationId, placeTypes],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (placeTypes) {
        placeTypes.forEach(type => params.append('placeTypes', type));
      }
      
      const response = await apiClient.get(
        `/places/tripadvisor/${destinationId}?${params.toString()}`
      );
      return response.data.data;
    },
    enabled: !!destinationId,
  });
};

export const useSyncTripadvisorPlaces = () => {
  return useMutation({
    mutationFn: async (data: PlaceSyncRequest) => {
      const response = await apiClient.post('/places/tripadvisor/sync', data);
      return response.data;
    },
  });
};

export const usePlanTrip = () => {
  return useMutation({
    mutationFn: async (data: TripPlanRequest) => {
      const response = await apiClient.post('/ai-trips/plan', data);
      return response.data;
    },
  });
};

export const useItineraryMap = (itineraryId: string) => {
  return useQuery({
    queryKey: ['itinerary-map', itineraryId],
    queryFn: async (): Promise<MapData> => {
      const response = await apiClient.get(`/map/itinerary/${itineraryId}`);
      return response.data.data;
    },
    enabled: !!itineraryId,
  });
};

export const useDestinationMap = (destinationId: string) => {
  return useQuery({
    queryKey: ['destination-map', destinationId],
    queryFn: async (): Promise<Partial<MapData>> => {
      const response = await apiClient.get(`/map/destination/${destinationId}`);
      return response.data.data;
    },
    enabled: !!destinationId,
  });
};
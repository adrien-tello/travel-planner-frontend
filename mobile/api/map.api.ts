import { apiClient } from './client.api';

export interface MapLocation {
  latitude: number;
  longitude: number;
  name: string;
  address?: string;
}

export interface ItineraryMapData {
  locations: MapLocation[];
  bounds: {
    northeast: { lat: number; lng: number };
    southwest: { lat: number; lng: number };
  };
  center: { lat: number; lng: number };
  apiKey: string;
}

export const mapApi = {
  getItineraryMap: async (places: Array<{ name: string; city: string; type: string }>) => {
    console.log('📍 Sending places to API:', places);
    if (!places || places.length === 0) {
      throw new Error('Places array is empty');
    }
    const response = await apiClient.post<{ success: boolean; data: ItineraryMapData }>(
      '/map/itinerary',
      { places }
    );
    return response.data.data;
  },

  getPlaceLocation: async (placeName: string, city: string) => {
    const response = await apiClient.get<{ success: boolean; data: MapLocation }>(
      '/map/location',
      { params: { placeName, city } }
    );
    return response.data.data;
  },
};

import { apiClient } from "./client.api";
import { ApiResponse } from "./types";
import { DetailedItinerary } from "./itinerary.api";

export interface Trip {
  id: string;
  destination: string;
  startDate: string;
  endDate: string;
  budget: string;
  createdAt: string;
  itinerary?: DetailedItinerary;
}

export const tripsApi = {
  // Get all user trips
  getTrips: async (): Promise<Trip[]> => {
    const response = await apiClient.get<ApiResponse<Trip[]>>("/trips");
    return response.data.data!;
  },

  // Create new trip
  createTrip: async (trip: Omit<Trip, "id" | "createdAt">): Promise<Trip> => {
    const response = await apiClient.post<ApiResponse<Trip>>("/trips", trip);
    return response.data.data!;
  },

  // Get single trip
  getTrip: async (id: string): Promise<Trip> => {
    const response = await apiClient.get<ApiResponse<Trip>>(`/trips/${id}`);
    return response.data.data!;
  },

  // Update trip
  updateTrip: async (id: string, trip: Partial<Trip>): Promise<Trip> => {
    const response = await apiClient.put<ApiResponse<Trip>>(`/trips/${id}`, trip);
    return response.data.data!;
  },

  // Delete trip
  deleteTrip: async (id: string): Promise<void> => {
    await apiClient.delete(`/trips/${id}`);
  },
};

export default tripsApi;
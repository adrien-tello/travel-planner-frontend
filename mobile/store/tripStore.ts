import { create } from "zustand"
import { tripsApi, Trip } from "../api/trips.api"

interface TripStore {
  trips: Trip[]
  loading: boolean
  addTrip: (trip: Omit<Trip, "id" | "createdAt">) => Promise<void>
  updateTrip: (id: string, trip: Partial<Trip>) => Promise<void>
  deleteTrip: (id: string) => Promise<void>
  getTrip: (id: string) => Trip | undefined
  loadTrips: () => Promise<void>
}

export const useTripStore = create<TripStore>((set, get) => ({
  trips: [],
  loading: false,

  addTrip: async (trip) => {
    try {
      const newTrip = await tripsApi.createTrip(trip);
      set((state) => ({
        trips: [newTrip, ...state.trips],
      }));
    } catch (error) {
      console.error('Failed to create trip:', error);
      throw error;
    }
  },

  updateTrip: async (id, updatedTrip) => {
    try {
      const updated = await tripsApi.updateTrip(id, updatedTrip);
      set((state) => ({
        trips: state.trips.map((trip) => (trip.id === id ? updated : trip)),
      }));
    } catch (error) {
      console.error('Failed to update trip:', error);
      throw error;
    }
  },

  deleteTrip: async (id) => {
    try {
      await tripsApi.deleteTrip(id);
      set((state) => ({
        trips: state.trips.filter((trip) => trip.id !== id),
      }));
    } catch (error) {
      console.error('Failed to delete trip:', error);
      throw error;
    }
  },

  getTrip: (id) => {
    return get().trips.find((trip) => trip.id === id)
  },

  loadTrips: async () => {
    try {
      set({ loading: true });
      const trips = await tripsApi.getTrips();
      set({ trips: trips || [], loading: false });
    } catch (error) {
      console.error('Failed to load trips:', error);
      set({ trips: [], loading: false });
    }
  },
}))

export type { Trip };
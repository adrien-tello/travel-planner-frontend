import { create } from "zustand"

export interface Trip {
  id: string
  destination: string
  startDate: string
  endDate: string
  budget: string
  createdAt: number
}

interface TripStore {
  trips: Trip[]
  addTrip: (trip: Omit<Trip, "id" | "createdAt">) => void
  updateTrip: (id: string, trip: Partial<Trip>) => void
  deleteTrip: (id: string) => void
  getTrip: (id: string) => Trip | undefined
}

export const useTripStore = create<TripStore>((set, get) => ({
  trips: [],

  addTrip: (trip) => {
    const newTrip: Trip = {
      ...trip,
      id: Date.now().toString(),
      createdAt: Date.now(),
    }
    set((state) => ({
      trips: [newTrip, ...state.trips],
    }))
  },

  updateTrip: (id, updatedTrip) => {
    set((state) => ({
      trips: state.trips.map((trip) => (trip.id === id ? { ...trip, ...updatedTrip } : trip)),
    }))
  },

  deleteTrip: (id) => {
    set((state) => ({
      trips: state.trips.filter((trip) => trip.id !== id),
    }))
  },

  getTrip: (id) => {
    return get().trips.find((trip) => trip.id === id)
  },
}))
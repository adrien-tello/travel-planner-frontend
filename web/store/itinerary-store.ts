import { create } from "zustand"

export interface TimelineEvent {
  id: string
  title: string
  startTime: string
  endTime: string
  location: string
  description?: string
  category: "accommodation" | "dining" | "activity" | "transport"
  coordinates?: { lat: number; lng: number }
  budget?: number
  notes?: string
}

export interface Itinerary {
  id: string
  userId: string
  destination: string
  startDate: string
  endDate: string
  numberOfTravelers: number
  budget: number
  days: ItineraryDay[]
  createdAt: string
  updatedAt: string
}

export interface ItineraryDay {
  date: string
  events: TimelineEvent[]
}

interface ItineraryStore {
  itineraries: Itinerary[]
  currentItinerary: Itinerary | null
  suggestions: TimelineEvent[]
  isGenerating: boolean
  setCurrentItinerary: (itinerary: Itinerary | null) => void
  addItinerary: (itinerary: Itinerary) => void
  updateItinerary: (itinerary: Itinerary) => void
  deleteItinerary: (id: string) => void
  addEvent: (dayIndex: number, event: TimelineEvent) => void
  updateEvent: (dayIndex: number, eventId: string, event: TimelineEvent) => void
  deleteEvent: (dayIndex: number, eventId: string) => void
  setSuggestions: (suggestions: TimelineEvent[]) => void
  setIsGenerating: (generating: boolean) => void
}

export const useItineraryStore = create<ItineraryStore>((set) => ({
  itineraries: [],
  currentItinerary: null,
  suggestions: [],
  isGenerating: false,
  setCurrentItinerary: (itinerary) => set({ currentItinerary: itinerary }),
  addItinerary: (itinerary) =>
    set((state) => ({
      itineraries: [...state.itineraries, itinerary],
    })),
  updateItinerary: (itinerary) =>
    set((state) => ({
      itineraries: state.itineraries.map((i) => (i.id === itinerary.id ? itinerary : i)),
      currentItinerary: state.currentItinerary?.id === itinerary.id ? itinerary : state.currentItinerary,
    })),
  deleteItinerary: (id) =>
    set((state) => ({
      itineraries: state.itineraries.filter((i) => i.id !== id),
      currentItinerary: state.currentItinerary?.id === id ? null : state.currentItinerary,
    })),
  addEvent: (dayIndex, event) =>
    set((state) => {
      if (!state.currentItinerary) return state
      const days = [...state.currentItinerary.days]
      days[dayIndex].events.push(event)
      return {
        currentItinerary: {
          ...state.currentItinerary,
          days,
        },
      }
    }),
  updateEvent: (dayIndex, eventId, event) =>
    set((state) => {
      if (!state.currentItinerary) return state
      const days = [...state.currentItinerary.days]
      days[dayIndex].events = days[dayIndex].events.map((e) => (e.id === eventId ? event : e))
      return {
        currentItinerary: {
          ...state.currentItinerary,
          days,
        },
      }
    }),
  deleteEvent: (dayIndex, eventId) =>
    set((state) => {
      if (!state.currentItinerary) return state
      const days = [...state.currentItinerary.days]
      days[dayIndex].events = days[dayIndex].events.filter((e) => e.id !== eventId)
      return {
        currentItinerary: {
          ...state.currentItinerary,
          days,
        },
      }
    }),
  setSuggestions: (suggestions) => set({ suggestions }),
  setIsGenerating: (generating) => set({ isGenerating: generating }),
}))

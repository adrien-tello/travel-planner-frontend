import { create } from "zustand"

export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  travelPreferences?: TravelPreferences
}

export interface TravelPreferences {
  budget: "budget" | "moderate" | "luxury"
  pace: "relaxed" | "moderate" | "fast"
  interests: string[]
  dietaryNeeds?: string[]
  accessibility?: string[]
}

interface UserStore {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  setUser: (user: User | null) => void
  setLoading: (loading: boolean) => void
  updatePreferences: (preferences: TravelPreferences) => void
  logout: () => void
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  isLoading: false,
  isAuthenticated: false,
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  setLoading: (isLoading) => set({ isLoading }),
  updatePreferences: (preferences) =>
    set((state) => ({
      user: state.user ? { ...state.user, travelPreferences: preferences } : null,
    })),
  logout: () => set({ user: null, isAuthenticated: false }),
}))

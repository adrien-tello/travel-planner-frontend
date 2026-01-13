import { create } from "zustand"

export interface HotelListing {
  id: string
  name: string
  location: string
  priceRange: "budget" | "moderate" | "luxury"
  availability: boolean
  rating: number
  imageUrl?: string
  amenities: string[]
  capacity: number
}

export interface Reservation {
  id: string
  hotelId: string
  guestName: string
  email: string
  checkIn: string
  checkOut: string
  status: "pending" | "approved" | "rejected"
  guests: number
}

interface AdminStore {
  hotels: HotelListing[]
  reservations: Reservation[]
  isLoading: boolean
  addHotel: (hotel: HotelListing) => void
  updateHotel: (hotel: HotelListing) => void
  deleteHotel: (id: string) => void
  setHotels: (hotels: HotelListing[]) => void
  setReservations: (reservations: Reservation[]) => void
  updateReservationStatus: (id: string, status: "pending" | "approved" | "rejected") => void
  setIsLoading: (loading: boolean) => void
}

export const useAdminStore = create<AdminStore>((set) => ({
  hotels: [],
  reservations: [],
  isLoading: false,
  addHotel: (hotel) =>
    set((state) => ({
      hotels: [...state.hotels, hotel],
    })),
  updateHotel: (hotel) =>
    set((state) => ({
      hotels: state.hotels.map((h) => (h.id === hotel.id ? hotel : h)),
    })),
  deleteHotel: (id) =>
    set((state) => ({
      hotels: state.hotels.filter((h) => h.id !== id),
    })),
  setHotels: (hotels) => set({ hotels }),
  setReservations: (reservations) => set({ reservations }),
  updateReservationStatus: (id, status) =>
    set((state) => ({
      reservations: state.reservations.map((r) => (r.id === id ? { ...r, status } : r)),
    })),
  setIsLoading: (loading) => set({ isLoading: loading }),
}))

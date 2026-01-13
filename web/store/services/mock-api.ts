import type { Itinerary, ItineraryDay, TimelineEvent } from "@/store/itinerary-store"
import type { HotelListing, Reservation } from "@/store/admin-store"

// Mock data
const MOCK_DESTINATIONS = [
  { id: "1", name: "Paris", country: "France", image: "/paris-cityscape.png" },
  { id: "2", name: "Tokyo", country: "Japan", image: "/tokyo-cityscape.png" },
  { id: "3", name: "Barcelona", country: "Spain", image: "/barcelona-cityscape.png" },
  { id: "4", name: "New York", country: "USA", image: "/newyork.jpg" },
  { id: "5", name: "Bangkok", country: "Thailand", image: "/bangkok-cityscape.png" },
]

const MOCK_HOTELS: HotelListing[] = [
  {
    id: "1",
    name: "Luxury Palace",
    location: "Paris",
    priceRange: "luxury",
    availability: true,
    rating: 4.8,
    amenities: ["WiFi", "Spa", "Restaurant", "Pool"],
    capacity: 4,
  },
  {
    id: "2",
    name: "Budget Inn",
    location: "Paris",
    priceRange: "budget",
    availability: true,
    rating: 4.2,
    amenities: ["WiFi", "Parking"],
    capacity: 2,
  },
  {
    id: "3",
    name: "Mid-Range Resort",
    location: "Paris",
    priceRange: "moderate",
    availability: false,
    rating: 4.5,
    amenities: ["WiFi", "Gym", "Restaurant"],
    capacity: 3,
  },
]

const MOCK_POI = {
  Paris: [
    {
      id: "1",
      title: "Eiffel Tower",
      category: "activity",
      duration: "2 hours",
      budget: 30,
      coordinates: { lat: 48.8584, lng: 2.2945 },
    },
    {
      id: "2",
      title: "Louvre Museum",
      category: "activity",
      duration: "3 hours",
      budget: 17,
      coordinates: { lat: 48.861, lng: 2.3358 },
    },
    {
      id: "3",
      title: "Café de Flore",
      category: "dining",
      duration: "1.5 hours",
      budget: 25,
      coordinates: { lat: 48.8535, lng: 2.333 },
    },
  ],
  Tokyo: [
    {
      id: "1",
      title: "Senso-ji Temple",
      category: "activity",
      duration: "1 hour",
      budget: 0,
      coordinates: { lat: 35.7149, lng: 139.7968 },
    },
    {
      id: "2",
      title: "Shibuya Crossing",
      category: "activity",
      duration: "1 hour",
      budget: 0,
      coordinates: { lat: 35.6595, lng: 139.7004 },
    },
    {
      id: "3",
      title: "Ramen Alley",
      category: "dining",
      duration: "1 hour",
      budget: 12,
      coordinates: { lat: 35.6762, lng: 139.7674 },
    },
  ],
}

// API Services
export const searchDestinations = async (query: string) => {
  await new Promise((resolve) => setTimeout(resolve, 500))
  return MOCK_DESTINATIONS.filter((d) => d.name.toLowerCase().includes(query.toLowerCase()))
}

export const generateItinerary = async (params: {
  destination: string
  startDate: string
  endDate: string
  numberOfTravelers: number
  budget: number
  preferences: any
}): Promise<Itinerary> => {
  await new Promise((resolve) => setTimeout(resolve, 1500))

  const startDate = new Date(params.startDate)
  const endDate = new Date(params.endDate)
  const days: ItineraryDay[] = []

  const currentDate = new Date(startDate)
  let dayIndex = 0

  while (currentDate <= endDate) {
    const dateStr = currentDate.toISOString().split("T")[0]
    const events: TimelineEvent[] = []

    // Add breakfast
    events.push({
      id: `breakfast-${dayIndex}`,
      title: "Breakfast",
      startTime: "08:00",
      endTime: "09:00",
      location: "Hotel",
      category: "dining",
      budget: 15,
    })

    // Add activity
    const poi = (MOCK_POI as any)[params.destination] || []
    if (poi.length > 0) {
      const activity = poi[dayIndex % poi.length]
      events.push({
        id: `activity-${dayIndex}`,
        title: activity.title,
        startTime: "10:00",
        endTime: "12:00",
        location: params.destination,
        category: "activity",
        budget: activity.budget,
        coordinates: activity.coordinates,
      })
    }

    // Add lunch
    events.push({
      id: `lunch-${dayIndex}`,
      title: "Lunch",
      startTime: "12:30",
      endTime: "13:30",
      location: "Local Restaurant",
      category: "dining",
      budget: 20,
    })

    // Add second activity
    if (poi.length > 1) {
      const activity = poi[(dayIndex + 1) % poi.length]
      events.push({
        id: `activity2-${dayIndex}`,
        title: activity.title,
        startTime: "14:30",
        endTime: "16:30",
        location: params.destination,
        category: "activity",
        budget: activity.budget,
        coordinates: activity.coordinates,
      })
    }

    // Add dinner
    events.push({
      id: `dinner-${dayIndex}`,
      title: "Dinner",
      startTime: "19:00",
      endTime: "20:30",
      location: "Fine Dining",
      category: "dining",
      budget: 40,
    })

    days.push({ date: dateStr, events })

    currentDate.setDate(currentDate.getDate() + 1)
    dayIndex++
  }

  return {
    id: Math.random().toString(36).substr(2, 9),
    userId: "user-1",
    destination: params.destination,
    startDate: params.startDate,
    endDate: params.endDate,
    numberOfTravelers: params.numberOfTravelers,
    budget: params.budget,
    days,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
}

export const getHotelSuggestions = async (
  destination: string,
  budget: "budget" | "moderate" | "luxury",
): Promise<HotelListing[]> => {
  await new Promise((resolve) => setTimeout(resolve, 800))
  return MOCK_HOTELS.filter((h) => h.location === destination)
}

export const getPOIDetails = async (poiId: string, destination: string) => {
  await new Promise((resolve) => setTimeout(resolve, 400))
  const poi = (MOCK_POI as any)[destination] || []
  return poi.find((p: any) => p.id === poiId)
}

export const getAdminHotels = async (): Promise<HotelListing[]> => {
  await new Promise((resolve) => setTimeout(resolve, 600))
  return MOCK_HOTELS
}

export const getAdminReservations = async (): Promise<Reservation[]> => {
  await new Promise((resolve) => setTimeout(resolve, 600))
  return [
    {
      id: "1",
      hotelId: "1",
      guestName: "John Doe",
      email: "john@example.com",
      checkIn: "2024-01-15",
      checkOut: "2024-01-20",
      status: "pending",
      guests: 2,
    },
    {
      id: "2",
      hotelId: "2",
      guestName: "Jane Smith",
      email: "jane@example.com",
      checkIn: "2024-01-18",
      checkOut: "2024-01-22",
      status: "approved",
      guests: 1,
    },
  ]
}

export const updateReservationStatus = async (reservationId: string, status: "pending" | "approved" | "rejected") => {
  await new Promise((resolve) => setTimeout(resolve, 500))
  return { id: reservationId, status }
}

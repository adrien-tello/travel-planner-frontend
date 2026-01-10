"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAdminStore } from "@/store/admin-store"
import { getAdminHotels, getAdminReservations, updateReservationStatus } from "@/services/mock-api"
import { MapPin, Plus, Star, CheckCircle, XCircle, Clock, Loader2 } from "lucide-react"
import Link from "next/link"

export default function AdminPage() {
  const router = useRouter()
  const hotels = useAdminStore((state) => state.hotels)
  const reservations = useAdminStore((state) => state.reservations)
  const setHotels = useAdminStore((state) => state.setHotels)
  const setReservations = useAdminStore((state) => state.setReservations)
  const updateReservationStatusStore = useAdminStore((state) => state.updateReservationStatus)

  const [loading, setLoading] = useState(true)
  const [selectedTab, setSelectedTab] = useState<"hotels" | "reservations">("hotels")
  const [processingId, setProcessingId] = useState<string | null>(null)

  useEffect(() => {
    const initializeAdmin = async () => {
      const [hotelsData, reservationsData] = await Promise.all([getAdminHotels(), getAdminReservations()])
      setHotels(hotelsData)
      setReservations(reservationsData)
      setLoading(false)
    }

    initializeAdmin()
  }, [setHotels, setReservations])

  const handleUpdateReservation = async (id: string, status: "pending" | "approved" | "rejected") => {
    setProcessingId(id)
    await updateReservationStatus(id, status)
    updateReservationStatusStore(id, status)
    setProcessingId(null)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
      case "rejected":
        return "bg-destructive/10 text-destructive"
      case "pending":
        return "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400"
      default:
        return "bg-muted"
    }
  }

  const getPriceRangeColor = (range: string) => {
    switch (range) {
      case "budget":
        return "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
      case "moderate":
        return "bg-blue-500/10 text-blue-700 dark:text-blue-400"
      case "luxury":
        return "bg-orange-500/10 text-orange-700 dark:text-orange-400"
      default:
        return "bg-muted"
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <MapPin className="w-8 h-8 text-primary" />
              <span className="font-bold text-xl">Admin Panel</span>
            </div>

            <Button asChild variant="outline">
              <Link href="/">Back to App</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Tab Navigation */}
        <div className="flex gap-4 mb-8 border-b border-border">
          <button
            onClick={() => setSelectedTab("hotels")}
            className={`pb-3 px-4 text-sm font-medium transition-colors ${
              selectedTab === "hotels"
                ? "border-b-2 border-primary text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Hotels
          </button>
          <button
            onClick={() => setSelectedTab("reservations")}
            className={`pb-3 px-4 text-sm font-medium transition-colors ${
              selectedTab === "reservations"
                ? "border-b-2 border-primary text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Reservations
          </button>
        </div>

        {/* Hotels Tab */}
        {selectedTab === "hotels" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Hotel Listings</h2>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Hotel
              </Button>
            </div>

            <div className="grid gap-6">
              {hotels.map((hotel) => (
                <Card key={hotel.id} className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-bold">{hotel.name}</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                        <MapPin className="w-4 h-4" />
                        <span>{hotel.location}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className="w-5 h-5 text-accent" />
                      <span className="font-semibold">{hotel.rating}</span>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <label className="text-xs text-muted-foreground">Price Range</label>
                      <Badge className={`mt-2 ${getPriceRangeColor(hotel.priceRange)}`} variant="secondary">
                        {hotel.priceRange}
                      </Badge>
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground">Capacity</label>
                      <p className="font-semibold mt-2">{hotel.capacity} Guests</p>
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground">Status</label>
                      <Badge className="mt-2" variant={hotel.availability ? "default" : "secondary"}>
                        {hotel.availability ? "Available" : "Full"}
                      </Badge>
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="text-xs text-muted-foreground">Amenities</label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {hotel.amenities.map((amenity) => (
                        <Badge key={amenity} variant="outline">
                          {amenity}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4 border-t border-border">
                    <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                      Edit
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                      Delete
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Reservations Tab */}
        {selectedTab === "reservations" && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Reservation Management</h2>

            <div className="space-y-4">
              {reservations.map((reservation) => {
                const hotel = hotels.find((h) => h.id === reservation.hotelId)
                return (
                  <Card key={reservation.id} className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-bold">{reservation.guestName}</h3>
                        <p className="text-sm text-muted-foreground">{hotel?.name}</p>
                      </div>
                      <Badge className={getStatusColor(reservation.status)} variant="secondary">
                        {reservation.status === "approved" && <CheckCircle className="w-4 h-4 mr-1" />}
                        {reservation.status === "rejected" && <XCircle className="w-4 h-4 mr-1" />}
                        {reservation.status === "pending" && <Clock className="w-4 h-4 mr-1" />}
                        {reservation.status.charAt(0).toUpperCase() + reservation.status.slice(1)}
                      </Badge>
                    </div>

                    <div className="grid md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <label className="text-xs text-muted-foreground">Guest Email</label>
                        <p className="font-medium text-sm mt-1">{reservation.email}</p>
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground">Check-In</label>
                        <p className="font-medium text-sm mt-1">{reservation.checkIn}</p>
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground">Check-Out</label>
                        <p className="font-medium text-sm mt-1">{reservation.checkOut}</p>
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground">Guests</label>
                        <p className="font-medium text-sm mt-1">{reservation.guests} people</p>
                      </div>
                    </div>

                    {reservation.status === "pending" && (
                      <div className="flex gap-2 pt-4 border-t border-border">
                        <Button
                          size="sm"
                          className="flex-1"
                          onClick={() => handleUpdateReservation(reservation.id, "approved")}
                          disabled={processingId === reservation.id}
                        >
                          {processingId === reservation.id ? (
                            <Loader2 className="w-4 h-4 animate-spin mr-2" />
                          ) : (
                            <CheckCircle className="w-4 h-4 mr-2" />
                          )}
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 bg-transparent"
                          onClick={() => handleUpdateReservation(reservation.id, "rejected")}
                          disabled={processingId === reservation.id}
                        >
                          {processingId === reservation.id ? (
                            <Loader2 className="w-4 h-4 animate-spin mr-2" />
                          ) : (
                            <XCircle className="w-4 h-4 mr-2" />
                          )}
                          Reject
                        </Button>
                      </div>
                    )}
                  </Card>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

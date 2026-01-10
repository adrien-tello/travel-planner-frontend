"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useUserStore } from "@/store/user-store"
import { useItineraryStore } from "@/store/itinerary-store"
import { ItinerarySummary } from "@/components/itinerary-summary"
import { MapPin, Plus, Trash2, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function MyTripsPage() {
  const router = useRouter()
  const user = useUserStore((state) => state.user)
  const itineraries = useItineraryStore((state) => state.itineraries)
  const deleteItinerary = useItineraryStore((state) => state.deleteItinerary)

  useEffect(() => {
    if (!user) {
      router.push("/auth/login")
    }
  }, [user, router])

  if (!user) return null

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <MapPin className="w-8 h-8 text-primary" />
              <span className="font-bold text-xl">Wanderlust</span>
            </div>

            <Button asChild size="sm">
              <Link href="/create-itinerary">
                <Plus className="w-4 h-4 mr-2" />
                New Trip
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-2">Your Trips</h1>
          <p className="text-muted-foreground">Manage and view all your planned adventures</p>
        </div>

        {itineraries.length === 0 ? (
          <div className="text-center py-12">
            <MapPin className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">No trips yet</h2>
            <p className="text-muted-foreground mb-8">Create your first trip to get started</p>
            <Button asChild>
              <Link href="/create-itinerary">
                <Plus className="w-4 h-4 mr-2" />
                Create Trip
              </Link>
            </Button>
          </div>
        ) : (
          <div className="grid gap-6">
            {itineraries.map((itinerary) => (
              <div key={itinerary.id} className="relative group">
                <div className="cursor-pointer mb-4" onClick={() => router.push(`/itinerary/${itinerary.id}`)}>
                  <ItinerarySummary itinerary={itinerary} />
                </div>

                <div className="flex gap-2 justify-end pt-4 border-t border-border">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/itinerary/${itinerary.id}`}>
                      <ArrowRight className="w-4 h-4 mr-2" />
                      View Details
                    </Link>
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      if (confirm("Are you sure you want to delete this trip?")) {
                        deleteItinerary(itinerary.id)
                      }
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

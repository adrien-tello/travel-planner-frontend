"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useItineraryStore, type TimelineEvent } from "@/store/itinerary-store"
import { useUserStore } from "@/store/user-store"
import { ItinerarySummary } from "@/components/itinerary-summary"
import { TimelineEventComponent } from "@/components/timeline-event"
import { BottomSheet } from "@/components/bottom-sheet"
import { SuggestionCard } from "@/components/suggestion-card"
import { ChevronLeft, Lightbulb, Map, Edit2, Clock, AlertCircle, MapPin, DollarSign, Calendar, Users, Info } from "lucide-react"
import Link from "next/link"

export default function ItineraryPage() {
  const router = useRouter()
  const params = useParams()
  const user = useUserStore((state) => state.user)
  const currentItinerary = useItineraryStore((state) => state.currentItinerary)
  const setCurrentItinerary = useItineraryStore((state) => state.setCurrentItinerary)
  const itineraries = useItineraryStore((state) => state.itineraries)

  const [selectedTab, setSelectedTab] = useState<"timeline" | "summary" | "tips">("timeline")

  useEffect(() => {
    if (!user) {
      router.push("/auth/login")
      return
    }

    const itinerary = itineraries.find((i) => i.id === params.id)
    if (itinerary) {
      setCurrentItinerary(itinerary)
    }
  }, [user, params.id, itineraries, setCurrentItinerary, router])

  if (!user || !currentItinerary) {
    return null
  }

  // Access the enhanced data from backend
  const summary = (currentItinerary as any).summary
  const detailedDays = (currentItinerary as any).days

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard" className="flex items-center gap-1">
                <ChevronLeft className="w-4 h-4" />
                Back
              </Link>
            </Button>

            <h1 className="text-xl font-bold">{currentItinerary.destination}</h1>

            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Edit2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Trip Overview */}
          <div className="lg:col-span-1">
            <div className="sticky top-20 space-y-6">
              <ItinerarySummary itinerary={currentItinerary} />
              
              {/* Trip Stats */}
              <Card className="p-4">
                <h3 className="font-semibold mb-3">Trip Overview</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span>{currentItinerary.days?.length || 0} days</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span>{currentItinerary.numberOfTravelers} travelers</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-muted-foreground" />
                    <span>${currentItinerary.budget?.toLocaleString() || 'N/A'} budget</span>
                  </div>
                  {summary?.totalCost && (
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-green-600" />
                      <span className="text-green-600">${summary.totalCost} estimated cost</span>
                    </div>
                  )}
                </div>
              </Card>

              {/* Destination Info */}
              {summary && (
                <Card className="p-4">
                  <h3 className="font-semibold mb-3">Destination Info</h3>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Best time to visit:</span>
                      <p>{summary.bestTimeToVisit}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Currency:</span>
                      <p>{summary.localCurrency}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Time zone:</span>
                      <p>{summary.timeZone}</p>
                    </div>
                  </div>
                </Card>
              )}
            </div>
          </div>

          {/* Right Column - Content */}
          <div className="lg:col-span-2">
            {/* Tab Navigation */}
            <div className="flex gap-2 mb-6 border-b border-border">
              <button
                onClick={() => setSelectedTab("timeline")}
                className={`pb-3 px-1 text-sm font-medium transition-colors ${
                  selectedTab === "timeline"
                    ? "border-b-2 border-primary text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Clock className="w-4 h-4 inline mr-2" />
                Daily Schedule
              </button>
              <button
                onClick={() => setSelectedTab("summary")}
                className={`pb-3 px-1 text-sm font-medium transition-colors ${
                  selectedTab === "summary"
                    ? "border-b-2 border-primary text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Info className="w-4 h-4 inline mr-2" />
                Trip Summary
              </button>
              <button
                onClick={() => setSelectedTab("tips")}
                className={`pb-3 px-1 text-sm font-medium transition-colors ${
                  selectedTab === "tips"
                    ? "border-b-2 border-primary text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Lightbulb className="w-4 h-4 inline mr-2" />
                Travel Tips
              </button>
            </div>

            {selectedTab === "timeline" && (
              <div className="space-y-8">
                {currentItinerary.days.map((day: any, dayIndex: number) => {
                  const detailedDay = detailedDays?.[dayIndex]
                  return (
                    <div key={dayIndex}>
                      <div className="mb-4">
                        <h3 className="text-lg font-bold">
                          {new Date(day.date).toLocaleDateString("en-US", {
                            weekday: "long",
                            month: "long",
                            day: "numeric",
                          })}
                        </h3>
                        {detailedDay?.theme && (
                          <p className="text-sm text-primary font-medium">{detailedDay.theme}</p>
                        )}
                        <p className="text-sm text-muted-foreground">
                          Day {dayIndex + 1} of {currentItinerary.days.length}
                          {detailedDay?.estimatedCost && (
                            <span className="ml-2">• ${detailedDay.estimatedCost} estimated</span>
                          )}
                        </p>
                      </div>

                      {/* Enhanced Events Timeline */}
                      <div className="space-y-3 mb-6">
                        {day.events.map((event: any) => (
                          <Card key={event.id} className="p-4">
                            <div className="flex justify-between items-start mb-2">
                              <div className="flex items-center gap-3">
                                <div className="text-sm font-mono bg-muted px-2 py-1 rounded">
                                  {event.startTime}
                                </div>
                                <div>
                                  <h4 className="font-semibold">{event.title}</h4>
                                  <p className="text-sm text-muted-foreground">{event.location}</p>
                                </div>
                              </div>
                              <div className="text-right text-sm">
                                <p className="font-medium">${event.budget}</p>
                                <p className="text-muted-foreground">{event.category}</p>
                              </div>
                            </div>
                            {event.description && (
                              <p className="text-sm text-muted-foreground mt-2">{event.description}</p>
                            )}
                            {event.venue && (
                              <div className="mt-2 text-xs text-muted-foreground">
                                {event.venue.rating && <span>★ {event.venue.rating}</span>}
                                {event.venue.priceRange && <span className="ml-2">{event.venue.priceRange}</span>}
                              </div>
                            )}
                          </Card>
                        ))}
                      </div>

                      {/* Daily Tips */}
                      {detailedDay?.tips && (
                        <Card className="p-4 bg-blue-50 border-blue-200">
                          <h4 className="font-semibold text-blue-900 mb-2">Daily Tips</h4>
                          <ul className="text-sm text-blue-800 space-y-1">
                            {detailedDay.tips.map((tip: string, idx: number) => (
                              <li key={idx}>• {tip}</li>
                            ))}
                          </ul>
                        </Card>
                      )}
                    </div>
                  )
                })}
              </div>
            )}

            {selectedTab === "summary" && summary && (
              <div className="space-y-6">
                <Card className="p-6">
                  <h3 className="text-xl font-bold mb-4">Trip Highlights</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {summary.highlights?.map((highlight: string, idx: number) => (
                      <div key={idx} className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-primary rounded-full" />
                        <span className="text-sm">{highlight}</span>
                      </div>
                    ))}
                  </div>
                </Card>

                {summary.accommodations?.length > 0 && (
                  <Card className="p-6">
                    <h3 className="text-xl font-bold mb-4">Accommodations</h3>
                    {summary.accommodations.map((hotel: any, idx: number) => (
                      <div key={idx} className="border rounded-lg p-4">
                        <h4 className="font-semibold">{hotel.name}</h4>
                        <p className="text-sm text-muted-foreground">★ {hotel.rating} • {hotel.priceRange}</p>
                        <p className="text-sm mt-1">{hotel.amenities?.join(', ')}</p>
                      </div>
                    ))}
                  </Card>
                )}

                <Card className="p-6">
                  <h3 className="text-xl font-bold mb-4">Budget Breakdown</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Total Budget:</span>
                      <span className="font-semibold">${currentItinerary.budget?.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Estimated Cost:</span>
                      <span className="font-semibold text-green-600">${summary.totalCost}</span>
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Remaining:</span>
                      <span>${(currentItinerary.budget - summary.totalCost).toLocaleString()}</span>
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {selectedTab === "tips" && summary && (
              <div className="space-y-6">
                <Card className="p-6">
                  <h3 className="text-xl font-bold mb-4">Weather Tips</h3>
                  <ul className="space-y-2">
                    {summary.weatherTips?.map((tip: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                        <span className="text-sm">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </Card>

                <Card className="p-6">
                  <h3 className="text-xl font-bold mb-4">Packing List</h3>
                  <div className="grid md:grid-cols-2 gap-2">
                    {summary.packingList?.map((item: string, idx: number) => (
                      <div key={idx} className="flex items-center gap-2">
                        <input type="checkbox" className="rounded" />
                        <span className="text-sm">{item}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

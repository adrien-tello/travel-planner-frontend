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
import { getHotelSuggestions } from "@/services/mock-api"
import { ChevronLeft, Lightbulb, Map, Edit2, Clock, AlertCircle } from "lucide-react"
import Link from "next/link"

export default function ItineraryPage() {
  const router = useRouter()
  const params = useParams()
  const user = useUserStore((state) => state.user)
  const currentItinerary = useItineraryStore((state) => state.currentItinerary)
  const setCurrentItinerary = useItineraryStore((state) => state.setCurrentItinerary)
  const itineraries = useItineraryStore((state) => state.itineraries)
  const addEvent = useItineraryStore((state) => state.addEvent)
  const updateEvent = useItineraryStore((state) => state.updateEvent)
  const deleteEvent = useItineraryStore((state) => state.deleteEvent)

  const [suggestions, setSuggestions] = useState<TimelineEvent[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedDayIndex, setSelectedDayIndex] = useState(0)
  const [editingEvent, setEditingEvent] = useState<TimelineEvent | null>(null)
  const [isGeneratingSuggestions, setIsGeneratingSuggestions] = useState(false)
  const [selectedTab, setSelectedTab] = useState<"timeline" | "map">("timeline")

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

  const generateSuggestions = async (dayIndex: number, eventId?: string) => {
    if (!currentItinerary) return

    setIsGeneratingSuggestions(true)
    setSelectedDayIndex(dayIndex)

    // Simulate API call to get suggestions
    await new Promise((resolve) => setTimeout(resolve, 1200))

    // Get hotel suggestions
    const hotels = await getHotelSuggestions(
      currentItinerary.destination,
      user?.travelPreferences?.budget || "moderate",
    )

    // Create mock suggestions from different categories
    const mockSuggestions: TimelineEvent[] = [
      // Hotel suggestions
      ...hotels.slice(0, 2).map((hotel, idx) => ({
        id: `hotel-${idx}`,
        title: hotel.name,
        startTime: "18:00",
        endTime: "09:00",
        location: hotel.location,
        category: "accommodation" as const,
        description: `${hotel.amenities.join(", ")} • Rating: ${hotel.rating}/5`,
        budget: 100 + idx * 50,
      })),

      // Restaurant suggestions
      {
        id: "dining-1",
        title: "Local Cuisine Restaurant",
        startTime: "19:00",
        endTime: "20:30",
        location: currentItinerary.destination,
        category: "dining" as const,
        budget: 35,
        description: "Highly rated local restaurant specializing in traditional cuisine",
      },

      // Activity suggestions
      {
        id: "activity-1",
        title: "Guided City Tour",
        startTime: "10:00",
        endTime: "13:00",
        location: currentItinerary.destination,
        category: "activity" as const,
        budget: 45,
        description: "Professional guided tour of main attractions",
      },
      {
        id: "activity-2",
        title: "Museum Visit",
        startTime: "14:00",
        endTime: "17:00",
        location: currentItinerary.destination,
        category: "activity" as const,
        budget: 20,
        description: "Explore the main art and history museum",
      },
    ]

    setSuggestions(mockSuggestions)
    setShowSuggestions(true)
    setIsGeneratingSuggestions(false)
  }

  const handleAddEvent = (suggestion: TimelineEvent) => {
    addEvent(selectedDayIndex, {
      ...suggestion,
      id: Math.random().toString(36).substr(2, 9),
    })
    setShowSuggestions(false)
  }

  if (!user || !currentItinerary) {
    return null
  }

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
          {/* Left Column - Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-20 space-y-6">
              <ItinerarySummary itinerary={currentItinerary} />

              <Card className="p-4 bg-primary/5 border-primary/20">
                <div className="flex gap-3">
                  <Lightbulb className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-semibold mb-1">Smart Suggestions</p>
                    <p className="text-muted-foreground">
                      Click on any event to get AI-powered alternatives and enhancements
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Right Column - Timeline */}
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
                Timeline
              </button>
              <button
                onClick={() => setSelectedTab("map")}
                className={`pb-3 px-1 text-sm font-medium transition-colors ${
                  selectedTab === "map"
                    ? "border-b-2 border-primary text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Map className="w-4 h-4 inline mr-2" />
                Map
              </button>
            </div>

            {selectedTab === "timeline" && (
              <div className="space-y-8">
                {currentItinerary.days.map((day, dayIndex) => (
                  <div key={dayIndex}>
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-bold">
                          {new Date(day.date).toLocaleDateString("en-US", {
                            weekday: "long",
                            month: "long",
                            day: "numeric",
                          })}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Day {dayIndex + 1} of {currentItinerary.days.length}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => generateSuggestions(dayIndex)}
                        disabled={isGeneratingSuggestions}
                      >
                        <Lightbulb className="w-4 h-4 mr-2" />
                        {isGeneratingSuggestions ? "Getting ideas..." : "Suggest"}
                      </Button>
                    </div>

                    {/* Events Timeline */}
                    <div className="space-y-3 mb-6">
                      {day.events.length === 0 ? (
                        <Card className="p-6 text-center border-dashed">
                          <p className="text-muted-foreground mb-3">No events scheduled for this day</p>
                          <Button
                            size="sm"
                            onClick={() => {
                              setSelectedDayIndex(dayIndex)
                              generateSuggestions(dayIndex)
                            }}
                          >
                            <Lightbulb className="w-4 h-4 mr-2" />
                            Get Suggestions
                          </Button>
                        </Card>
                      ) : (
                        day.events.map((event) => (
                          <div
                            key={event.id}
                            onClick={() => {
                              setSelectedDayIndex(dayIndex)
                              generateSuggestions(dayIndex, event.id)
                            }}
                            className="cursor-pointer"
                          >
                            <TimelineEventComponent
                              event={event}
                              onEdit={() => setEditingEvent(event)}
                              onDelete={() => deleteEvent(dayIndex, event.id)}
                            />
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {selectedTab === "map" && (
              <Card className="p-8 text-center border-dashed">
                <Map className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">Interactive map with event markers coming soon</p>
                <p className="text-sm text-muted-foreground">Map will sync with timeline events and show coordinates</p>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Smart Suggestions Bottom Sheet */}
      <BottomSheet isOpen={showSuggestions} onClose={() => setShowSuggestions(false)} title="Smart Suggestions">
        <div className="space-y-4">
          {suggestions.length === 0 ? (
            <Card className="p-6 text-center border-dashed">
              <AlertCircle className="w-8 h-8 text-muted-foreground/50 mx-auto mb-2" />
              <p className="text-muted-foreground">No suggestions available</p>
            </Card>
          ) : (
            suggestions.map((suggestion) => (
              <SuggestionCard key={suggestion.id} suggestion={suggestion} onSelect={handleAddEvent} />
            ))
          )}
        </div>
      </BottomSheet>
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useUserStore } from "@/store/user-store"
import { useItineraryStore } from "@/store/itinerary-store"
import { searchDestinations } from "@/services/mock-api"
import { DestinationCard } from "@/components/destination-card"
import { ItinerarySummary } from "@/components/itinerary-summary"
import { Loader2, MapPin, Plus, Search, Sparkles, LogOut } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  const router = useRouter()
  const user = useUserStore((state) => state.user)
  const logout = useUserStore((state) => state.logout)
  const itineraries = useItineraryStore((state) => state.itineraries)

  const [searchQuery, setSearchQuery] = useState("")
  const [destinations, setDestinations] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [recentSearches, setRecentSearches] = useState<string[]>([])

  useEffect(() => {
    if (!user) {
      router.push("/auth/login")
    }
  }, [user, router])

  const handleSearch = async () => {
    if (!searchQuery.trim()) return

    setLoading(true)
    const results = await searchDestinations(searchQuery)
    setDestinations(results)
    setLoading(false)

    // Add to recent searches
    if (!recentSearches.includes(searchQuery)) {
      setRecentSearches([searchQuery, ...recentSearches.slice(0, 4)])
    }
  }

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <MapPin className="w-8 h-8 text-primary" />
              <span className="font-bold text-xl">Wanderlust</span>
            </div>

            <nav className="hidden md:flex gap-6">
              <Link href="/dashboard" className="text-sm font-medium text-foreground hover:text-primary">
                Home
              </Link>
              <Link href="/my-trips" className="text-sm font-medium text-muted-foreground hover:text-foreground">
                My Trips
              </Link>
              <Link href="/profile" className="text-sm font-medium text-muted-foreground hover:text-foreground">
                Profile
              </Link>
            </nav>

            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">{user.name}</span>
              <Button size="sm" variant="ghost" onClick={handleLogout}>
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Section */}
        <section className="mb-12">
          <h1 className="text-4xl font-bold mb-2">Welcome back, {user.name.split(" ")[0]}!</h1>
          <p className="text-muted-foreground">Plan your next adventure with AI assistance</p>
        </section>

        {/* Search Section */}
        <section className="mb-12">
          <div className="flex gap-4 mb-6">
            <div className="flex-1 flex gap-2">
              <Input
                placeholder="Where do you want to go? (e.g., Paris, Tokyo)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="text-lg"
              />
              <Button onClick={handleSearch} disabled={loading} size="lg" className="px-8">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              </Button>
            </div>
            <Button asChild size="lg" variant="outline">
              <Link href="/create-itinerary">
                <Plus className="w-4 h-4 mr-2" />
                Create Trip
              </Link>
            </Button>
          </div>

          {/* Recent Searches */}
          {recentSearches.length > 0 && destinations.length === 0 && (
            <div className="flex gap-2 flex-wrap">
              <span className="text-sm text-muted-foreground self-center">Recent:</span>
              {recentSearches.map((search) => (
                <Button
                  key={search}
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSearchQuery(search)
                    setTimeout(() => {
                      searchDestinations(search).then(setDestinations)
                    }, 0)
                  }}
                  className="rounded-full"
                >
                  {search}
                </Button>
              ))}
            </div>
          )}
        </section>

        {/* Search Results */}
        {searchQuery && destinations.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Results for "{searchQuery}"</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {destinations.map((destination) => (
                <DestinationCard
                  key={destination.id}
                  id={destination.id}
                  name={destination.name}
                  country={destination.country}
                  image={destination.image}
                  onSelect={() => {
                    router.push(`/create-itinerary?destination=${destination.name}`)
                  }}
                />
              ))}
            </div>
          </section>
        )}

        {/* Active Trips */}
        {itineraries.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Your Trips</h2>
              <Link href="/my-trips" className="text-primary hover:underline text-sm font-medium">
                View all →
              </Link>
            </div>

            <div className="grid gap-6">
              {itineraries.slice(0, 3).map((itinerary) => (
                <div
                  key={itinerary.id}
                  className="cursor-pointer"
                  onClick={() => router.push(`/itinerary/${itinerary.id}`)}
                >
                  <ItinerarySummary itinerary={itinerary} />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Empty State */}
        {destinations.length === 0 && !searchQuery && itineraries.length === 0 && (
          <section className="text-center py-12">
            <Sparkles className="w-16 h-16 text-primary/50 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Start Planning Your Adventure</h2>
            <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
              Search for a destination or create a new trip to get started with AI-powered itinerary generation.
            </p>
            <Button asChild size="lg">
              <Link href="/create-itinerary">
                <Sparkles className="w-4 h-4 mr-2" />
                Create Your First Trip
              </Link>
            </Button>
          </section>
        )}

        {/* Quick Destinations */}
        {destinations.length === 0 && !searchQuery && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Popular Destinations</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { id: "1", name: "Paris", country: "France", image: "/paris-cityscape.png" },
                { id: "2", name: "Tokyo", country: "Japan", image: "/tokyo-cityscape.png" },
                { id: "3", name: "Barcelona", country: "Spain", image: "/barcelona-cityscape.png" },
                { id: "4", name: "New York", country: "USA", image: "/newyork.jpg" },
                { id: "5", name: "Bangkok", country: "Thailand", image: "/bangkok-cityscape.png" },
              ].map((destination) => (
                <DestinationCard
                  key={destination.id}
                  {...destination}
                  onSelect={() => {
                    router.push(`/create-itinerary?destination=${destination.name}`)
                  }}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}

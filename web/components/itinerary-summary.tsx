"use client"

import type { Itinerary } from "@/store/itinerary-store"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Calendar, Users, DollarSign } from "lucide-react"

interface ItinerarySummaryProps {
  itinerary: Itinerary
}

export function ItinerarySummary({ itinerary }: ItinerarySummaryProps) {
  const startDate = new Date(itinerary.startDate).toLocaleDateString()
  const endDate = new Date(itinerary.endDate).toLocaleDateString()
  const days = itinerary.days.length
  const totalBudget = itinerary.budget
  const spentBudget = itinerary.days.reduce((sum, day) => {
    return sum + day.events.reduce((daySum, event) => daySum + (event.budget || 0), 0)
  }, 0)

  return (
    <Card className="p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold">{itinerary.destination}</h2>
          <p className="text-muted-foreground">{days} day trip</p>
        </div>
        <Badge variant="outline" className="text-lg px-3 py-1">
          {days} days
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-6">
        <div className="flex items-center gap-3">
          <Calendar className="w-5 h-5 text-primary" />
          <div>
            <p className="text-xs text-muted-foreground">Dates</p>
            <p className="font-semibold text-sm">
              {startDate} - {endDate}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Users className="w-5 h-5 text-primary" />
          <div>
            <p className="text-xs text-muted-foreground">Travelers</p>
            <p className="font-semibold text-sm">{itinerary.numberOfTravelers} people</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <DollarSign className="w-5 h-5 text-accent" />
          <div>
            <p className="text-xs text-muted-foreground">Budget</p>
            <p className="font-semibold text-sm">${totalBudget}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <MapPin className="w-5 h-5 text-primary" />
          <div>
            <p className="text-xs text-muted-foreground">Spent</p>
            <p className="font-semibold text-sm">${spentBudget}</p>
          </div>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-border">
        <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary to-accent"
            style={{ width: `${Math.min((spentBudget / totalBudget) * 100, 100)}%` }}
          />
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          ${spentBudget} of ${totalBudget} budgeted
        </p>
      </div>
    </Card>
  )
}

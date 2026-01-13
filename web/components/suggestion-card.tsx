"use client"

import type { TimelineEvent } from "@/store/itinerary-store"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DollarSign, Clock, Plus } from "lucide-react"

interface SuggestionCardProps {
  suggestion: TimelineEvent
  onSelect?: (suggestion: TimelineEvent) => void
}

export function SuggestionCard({ suggestion, onSelect }: SuggestionCardProps) {
  const getBudgetColor = (budget?: number) => {
    if (!budget) return "bg-muted"
    if (budget < 20) return "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
    if (budget < 50) return "bg-blue-500/10 text-blue-700 dark:text-blue-400"
    return "bg-orange-500/10 text-orange-700 dark:text-orange-400"
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "accommodation":
        return "bg-primary/10 text-primary"
      case "dining":
        return "bg-accent/10 text-accent"
      case "activity":
        return "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
      case "transport":
        return "bg-blue-500/10 text-blue-700 dark:text-blue-400"
      default:
        return "bg-muted"
    }
  }

  return (
    <Card className="overflow-hidden hover:border-primary/50 transition-colors">
      <div className="p-4">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1">
            <h3 className="font-semibold line-clamp-2">{suggestion.title}</h3>
            <p className="text-sm text-muted-foreground mt-1">{suggestion.location}</p>
          </div>
          <Badge className={getCategoryColor(suggestion.category)} variant="secondary">
            {suggestion.category}
          </Badge>
        </div>

        {suggestion.description && <p className="text-sm text-muted-foreground mb-3">{suggestion.description}</p>}

        <div className="flex gap-3 mb-4 flex-wrap">
          {suggestion.startTime && (
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>{suggestion.startTime}</span>
            </div>
          )}
          {suggestion.budget !== undefined && (
            <div className={`flex items-center gap-1 text-sm px-2 py-1 rounded ${getBudgetColor(suggestion.budget)}`}>
              <DollarSign className="w-4 h-4" />
              <span>${suggestion.budget}</span>
            </div>
          )}
        </div>

        {onSelect && (
          <Button size="sm" onClick={() => onSelect(suggestion)} className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            Add to Itinerary
          </Button>
        )}
      </div>
    </Card>
  )
}

"use client"

import type { TimelineEvent } from "@/store/itinerary-store"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, DollarSign, Edit2, Trash2 } from "lucide-react"

interface TimelineEventProps {
  event: TimelineEvent
  draggable?: boolean
  onEdit?: (event: TimelineEvent) => void
  onDelete?: (eventId: string) => void
}

export function TimelineEventComponent({ event, draggable = true, onEdit, onDelete }: TimelineEventProps) {
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
    <div className={draggable ? "cursor-move" : ""}>
      <Card className="overflow-hidden">
        <div className="p-4">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-mono text-muted-foreground">
                  {event.startTime} - {event.endTime}
                </span>
                <Badge className={getCategoryColor(event.category)} variant="secondary">
                  {event.category}
                </Badge>
              </div>
              <h3 className="font-semibold">{event.title}</h3>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                <MapPin className="w-4 h-4" />
                <span>{event.location}</span>
              </div>
            </div>

            {(onEdit || onDelete) && (
              <div className="flex gap-1">
                {onEdit && (
                  <Button size="sm" variant="ghost" onClick={() => onEdit(event)}>
                    <Edit2 className="w-4 h-4" />
                  </Button>
                )}
                {onDelete && (
                  <Button size="sm" variant="ghost" onClick={() => onDelete(event.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            )}
          </div>

          {event.description && <p className="text-sm text-muted-foreground mb-3">{event.description}</p>}

          {event.budget && (
            <div className="flex items-center gap-2 text-sm">
              <DollarSign className="w-4 h-4 text-accent" />
              <span className="font-semibold">${event.budget}</span>
            </div>
          )}

          {event.notes && <p className="text-xs text-muted-foreground mt-3 italic">{event.notes}</p>}
        </div>
      </Card>
    </div>
  )
}

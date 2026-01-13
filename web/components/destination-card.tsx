"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowRight } from "lucide-react"

interface DestinationCardProps {
  id: string
  name: string
  country: string
  image: string
  onSelect?: () => void
}

export function DestinationCard({ name, country, image, onSelect }: DestinationCardProps) {
  return (
    <Card className="overflow-hidden hover:border-primary/50 transition-all group cursor-pointer h-60">
      <div className="relative h-full">
        <Image
          src={image || "/placeholder.svg"}
          alt={name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/0 flex flex-col justify-end p-4">
          <h3 className="text-xl font-bold text-white">{name}</h3>
          <p className="text-white/80 text-sm">{country}</p>
          {onSelect && (
            <Button size="sm" className="mt-3 w-full" onClick={onSelect}>
              Explore
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </Card>
  )
}

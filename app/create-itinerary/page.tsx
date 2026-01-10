"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { InputField } from "@/components/input-field"
import { SelectField } from "@/components/select-field"
import { useUserStore } from "@/store/user-store"
import { useItineraryStore } from "@/store/itinerary-store"
import { generateItinerary } from "@/services/mock-api"
import { MapPin, Calendar, Users, DollarSign, Loader2, ChevronLeft } from "lucide-react"
import Link from "next/link"

export default function CreateItineraryPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const user = useUserStore((state) => state.user)
  const addItinerary = useItineraryStore((state) => state.addItinerary)
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    destination: searchParams.get("destination") || "",
    startDate: "",
    endDate: "",
    numberOfTravelers: "1",
    budget: "",
  })

  useEffect(() => {
    if (!user) {
      router.push("/auth/login")
    }
  }, [user, router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleNext = async () => {
    if (step === 1) {
      if (!formData.destination || !formData.startDate || !formData.endDate) {
        alert("Please fill in all fields")
        return
      }
      setStep(2)
    } else {
      if (!formData.numberOfTravelers || !formData.budget) {
        alert("Please fill in all fields")
        return
      }

      setLoading(true)
      const itinerary = await generateItinerary({
        destination: formData.destination,
        startDate: formData.startDate,
        endDate: formData.endDate,
        numberOfTravelers: Number.parseInt(formData.numberOfTravelers),
        budget: Number.parseInt(formData.budget),
        preferences: user?.travelPreferences,
      })

      addItinerary(itinerary)
      setLoading(false)
      router.push(`/itinerary/${itinerary.id}`)
    }
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <div className="max-w-2xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-12">
          <Button variant="ghost" size="sm" asChild className="mb-4">
            <Link href="/dashboard" className="flex items-center gap-1">
              <ChevronLeft className="w-4 h-4" />
              Back
            </Link>
          </Button>
          <h1 className="text-4xl font-bold mb-2">Plan Your Trip</h1>
          <p className="text-muted-foreground">Let AI create the perfect itinerary for you</p>
        </div>

        {/* Progress */}
        <div className="flex gap-2 justify-center mb-12">
          {[1, 2].map((i) => (
            <div key={i} className={`h-2 w-8 rounded-full transition-all ${i <= step ? "bg-primary" : "bg-border"}`} />
          ))}
        </div>

        {/* Form */}
        <Card className="p-8 mb-6">
          {step === 1 ? (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-1">Trip Details</h2>
                <p className="text-muted-foreground">Where and when do you want to travel?</p>
              </div>

              <InputField
                label="Destination"
                name="destination"
                placeholder="e.g., Paris, Tokyo, Barcelona"
                value={formData.destination}
                onChange={handleChange}
                icon={<MapPin className="w-5 h-5" />}
              />

              <div className="grid md:grid-cols-2 gap-4">
                <InputField
                  label="Start Date"
                  name="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={handleChange}
                  icon={<Calendar className="w-5 h-5" />}
                />
                <InputField
                  label="End Date"
                  name="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={handleChange}
                  icon={<Calendar className="w-5 h-5" />}
                />
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-1">Budget & Group Size</h2>
                <p className="text-muted-foreground">Help us tailor recommendations</p>
              </div>

              <SelectField
                label="Number of Travelers"
                value={formData.numberOfTravelers}
                onValueChange={(value) => handleSelectChange("numberOfTravelers", value)}
                options={[
                  { value: "1", label: "Solo Traveler" },
                  { value: "2", label: "2 People" },
                  { value: "3", label: "3 People" },
                  { value: "4", label: "4 People" },
                  { value: "5+", label: "5+ People" },
                ]}
                icon={<Users className="w-5 h-5" />}
              />

              <InputField
                label="Total Budget (USD)"
                name="budget"
                type="number"
                placeholder="e.g., 5000"
                value={formData.budget}
                onChange={handleChange}
                icon={<DollarSign className="w-5 h-5" />}
              />

              <Card className="bg-primary/5 border-primary/20 p-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Destination</p>
                    <p className="font-semibold">{formData.destination}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Duration</p>
                    <p className="font-semibold">
                      {formData.startDate && formData.endDate
                        ? `${Math.ceil((new Date(formData.endDate).getTime() - new Date(formData.startDate).getTime()) / (1000 * 60 * 60 * 24))} days`
                        : "-"}
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          )}
        </Card>

        {/* Navigation */}
        <div className="flex gap-4">
          {step === 2 && (
            <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
              Back
            </Button>
          )}
          <Button onClick={handleNext} disabled={loading} className="flex-1">
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating Itinerary...
              </>
            ) : step === 1 ? (
              "Next"
            ) : (
              "Generate Itinerary"
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}

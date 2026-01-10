"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useUserStore } from "@/store/user-store"
import { Globe, Loader2, ChevronRight } from "lucide-react"
import type { TravelPreferences } from "@/store/user-store"

export default function OnboardingPage() {
  const router = useRouter()
  const user = useUserStore((state) => state.user)
  const updatePreferences = useUserStore((state) => state.updatePreferences)
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [preferences, setPreferences] = useState<Partial<TravelPreferences>>({
    budget: "moderate",
    pace: "moderate",
    interests: [],
    dietaryNeeds: [],
  })

  if (!user) {
    router.push("/auth/signup")
    return null
  }

  const budgetOptions = [
    { id: "budget", label: "Budget", description: "$30-50/day" },
    { id: "moderate", label: "Moderate", description: "$50-150/day" },
    { id: "luxury", label: "Luxury", description: "$150+/day" },
  ]

  const paceOptions = [
    { id: "relaxed", label: "Relaxed", description: "Slow travel, immerse myself" },
    { id: "moderate", label: "Moderate", description: "Balance of activities & rest" },
    { id: "fast", label: "Fast-Paced", description: "See as much as possible" },
  ]

  const interestOptions = [
    "Culture",
    "Nature",
    "Food",
    "Adventure",
    "Relaxation",
    "History",
    "Art",
    "Shopping",
    "Photography",
    "Nightlife",
  ]

  const dietaryOptions = ["Vegetarian", "Vegan", "Gluten-Free", "Kosher", "Halal"]

  const toggleInterest = (interest: string) => {
    setPreferences((prev) => ({
      ...prev,
      interests: prev.interests?.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...(prev.interests || []), interest],
    }))
  }

  const toggleDiet = (diet: string) => {
    setPreferences((prev) => ({
      ...prev,
      dietaryNeeds: prev.dietaryNeeds?.includes(diet)
        ? prev.dietaryNeeds.filter((d) => d !== diet)
        : [...(prev.dietaryNeeds || []), diet],
    }))
  }

  const handleSubmit = async () => {
    setLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))

    if (preferences.budget && preferences.pace) {
      updatePreferences(preferences as TravelPreferences)
      router.push("/dashboard")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <div className="max-w-2xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Globe className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold">Wanderlust</h1>
          </div>
          <p className="text-muted-foreground mb-8">Let's customize your travel experience</p>

          {/* Progress */}
          <div className="flex gap-2 justify-center mb-8">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className={`h-2 w-2 rounded-full transition-all ${i <= step ? "bg-primary w-8" : "bg-border"}`}
              />
            ))}
          </div>
        </div>

        {/* Step 1: Budget */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">What's your travel budget?</h2>
              <p className="text-muted-foreground">This helps us suggest accommodations and activities</p>
            </div>

            <div className="grid gap-4">
              {budgetOptions.map((option) => (
                <Card
                  key={option.id}
                  className={`p-4 cursor-pointer border-2 transition-all ${
                    preferences.budget === option.id
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                  onClick={() => setPreferences((prev) => ({ ...prev, budget: option.id as any }))}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold">{option.label}</h3>
                      <p className="text-sm text-muted-foreground">{option.description}</p>
                    </div>
                    <div className="w-6 h-6 rounded-full border-2 border-primary flex items-center justify-center">
                      {preferences.budget === option.id && <div className="w-3 h-3 rounded-full bg-primary" />}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Pace */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">What's your travel pace?</h2>
              <p className="text-muted-foreground">How do you prefer to explore destinations</p>
            </div>

            <div className="grid gap-4">
              {paceOptions.map((option) => (
                <Card
                  key={option.id}
                  className={`p-4 cursor-pointer border-2 transition-all ${
                    preferences.pace === option.id
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                  onClick={() => setPreferences((prev) => ({ ...prev, pace: option.id as any }))}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold">{option.label}</h3>
                      <p className="text-sm text-muted-foreground">{option.description}</p>
                    </div>
                    <div className="w-6 h-6 rounded-full border-2 border-primary flex items-center justify-center">
                      {preferences.pace === option.id && <div className="w-3 h-3 rounded-full bg-primary" />}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Interests */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">What interests you?</h2>
              <p className="text-muted-foreground">Select as many as you like</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {interestOptions.map((interest) => (
                <Card
                  key={interest}
                  className={`p-4 cursor-pointer border-2 transition-all text-center ${
                    preferences.interests?.includes(interest)
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                  onClick={() => toggleInterest(interest)}
                >
                  <p className="font-medium">{interest}</p>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Step 4: Dietary & Accessibility */}
        {step === 4 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-4">Any special needs?</h2>
              <p className="text-muted-foreground mb-6">Help us provide better recommendations</p>

              <div>
                <h3 className="font-semibold mb-3">Dietary preferences</h3>
                <div className="grid grid-cols-2 gap-3">
                  {dietaryOptions.map((diet) => (
                    <Card
                      key={diet}
                      className={`p-3 cursor-pointer border-2 transition-all text-center ${
                        preferences.dietaryNeeds?.includes(diet)
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                      onClick={() => toggleDiet(diet)}
                    >
                      <p className="text-sm font-medium">{diet}</p>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex gap-4 mt-12">
          {step > 1 && (
            <Button variant="outline" onClick={() => setStep(step - 1)} className="flex-1">
              Back
            </Button>
          )}

          <Button
            onClick={() => (step === 4 ? handleSubmit() : setStep(step + 1))}
            disabled={loading}
            className="flex-1"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Getting Ready...
              </>
            ) : (
              <>
                {step === 4 ? "Complete Setup" : "Next"}
                <ChevronRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}

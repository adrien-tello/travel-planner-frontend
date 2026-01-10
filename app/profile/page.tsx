"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useUserStore } from "@/store/user-store"
import { MapPin, User, Edit2, LogOut, ChevronLeft } from "lucide-react"
import Link from "next/link"
import { BudgetIndicator } from "@/components/budget-indicator"

export default function ProfilePage() {
  const router = useRouter()
  const user = useUserStore((state) => state.user)
  const logout = useUserStore((state) => state.logout)

  useEffect(() => {
    if (!user) {
      router.push("/auth/login")
    }
  }, [user, router])

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <MapPin className="w-8 h-8 text-primary" />
              <span className="font-bold text-xl">Wanderlust</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Button variant="ghost" size="sm" asChild className="mb-8">
          <Link href="/dashboard" className="flex items-center gap-1">
            <ChevronLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
        </Button>

        <h1 className="text-4xl font-bold mb-8">Profile Settings</h1>

        {/* Profile Card */}
        <Card className="p-8 mb-8">
          <div className="flex items-start justify-between mb-8">
            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">{user.name}</h2>
                  <p className="text-muted-foreground">{user.email}</p>
                </div>
              </div>
            </div>
            <Button variant="outline" size="sm">
              <Edit2 className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          </div>

          <div className="border-t border-border pt-8">
            <h3 className="font-semibold mb-4">Account Information</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm text-muted-foreground">Full Name</label>
                <p className="font-medium mt-1">{user.name}</p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Email</label>
                <div className="flex items-center gap-2 mt-1">
                  <p className="font-medium">{user.email}</p>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Verified</span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Travel Preferences */}
        {user.travelPreferences && (
          <Card className="p-8 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-lg">Travel Preferences</h3>
              <Button variant="outline" size="sm">
                <Edit2 className="w-4 h-4 mr-2" />
                Update
              </Button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm text-muted-foreground">Budget</label>
                <div className="mt-2">
                  <BudgetIndicator amount={0} budget={user.travelPreferences.budget} />
                </div>
              </div>

              <div>
                <label className="text-sm text-muted-foreground">Travel Pace</label>
                <p className="font-medium mt-2 capitalize">{user.travelPreferences.pace} Pace</p>
              </div>

              <div className="md:col-span-2">
                <label className="text-sm text-muted-foreground">Interests</label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {user.travelPreferences.interests.map((interest) => (
                    <span key={interest} className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                      {interest}
                    </span>
                  ))}
                </div>
              </div>

              {user.travelPreferences.dietaryNeeds && user.travelPreferences.dietaryNeeds.length > 0 && (
                <div className="md:col-span-2">
                  <label className="text-sm text-muted-foreground">Dietary Preferences</label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {user.travelPreferences.dietaryNeeds.map((diet) => (
                      <span key={diet} className="bg-accent/10 text-accent px-3 py-1 rounded-full text-sm">
                        {diet}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Card>
        )}

        {/* Danger Zone */}
        <Card className="p-8 border-destructive/50 bg-destructive/5">
          <h3 className="font-semibold text-lg text-destructive mb-4">Danger Zone</h3>
          <Button variant="destructive" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </Card>
      </div>
    </div>
  )
}

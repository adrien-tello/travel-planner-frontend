"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { MapPin, Sparkles, Compass, Globe } from "lucide-react"
import Link from "next/link"

export default function Home() {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      {/* Navigation */}
      <nav className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <Globe className="w-8 h-8 text-primary" />
              <span className="font-bold text-xl">Wanderlust</span>
            </div>
            <div className="flex gap-4">
              <Button variant="ghost" asChild>
                <Link href="/login">Sign In</Link>
              </Button>
              <Button asChild>
                <Link href="/signup">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 mb-6">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">AI-Powered Travel Planning</span>
            </div>

            <h1 className="text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              Your Perfect Trip,
              <span className="text-primary"> Perfectly Planned</span>
            </h1>

            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Let AI create personalized itineraries, find budget-friendly hotels, and discover hidden gems tailored to
              your travel style.
            </p>

            <div className="flex gap-4">
              <Button size="lg" asChild>
                <Link href="/auth/signup">Start Planning</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="#demo">See Demo</Link>
              </Button>
            </div>
          </div>

          {/* Hero Image */}
          <div
            className="relative h-96 rounded-2xl overflow-hidden border border-border/50 bg-muted"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <MapPin
                  className={`w-20 h-20 mx-auto text-primary transition-transform ${isHovered ? "scale-110" : ""}`}
                />
                <p className="text-muted-foreground mt-4">Interactive map & timeline</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-card border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <h2 className="text-3xl font-bold text-center mb-12">Features That Matter</h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Sparkles,
                title: "AI Itinerary Generation",
                description: "Generate complete daily itineraries based on your preferences in seconds",
              },
              {
                icon: MapPin,
                title: "Smart Suggestions",
                description: "Get budget-aware recommendations for hotels, restaurants, and activities",
              },
              {
                icon: Compass,
                title: "Interactive Timeline",
                description: "Drag-and-drop event organization with map synchronization",
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="p-6 rounded-xl border border-border bg-background hover:border-primary/50 transition-colors"
              >
                <feature.icon className="w-8 h-8 text-primary mb-4" />
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 rounded-2xl p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Explore?</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Start planning your next adventure with AI assistance. Create an account in seconds.
          </p>
          <Button size="lg" asChild>
            <Link href="/auth/signup">Begin Your Journey</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Globe className="w-6 h-6 text-primary" />
              <span className="font-semibold">Wanderlust</span>
            </div>
            <p className="text-sm text-muted-foreground">© 2025 Wanderlust. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

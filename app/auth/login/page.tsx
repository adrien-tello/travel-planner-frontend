"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { AuthLayout } from "@/components/auth-layout"
import { InputField } from "@/components/input-field"
import { Button } from "@/components/ui/button"
import { useUserStore } from "@/store/user-store"
import Link from "next/link"
import { Globe, Loader2 } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const setUser = useUserStore((state) => state.setUser)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors: Record<string, string> = {}

    if (!formData.email) newErrors.email = "Email is required"
    if (!formData.password) newErrors.password = "Password is required"

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setUser({
      id: "user-" + Math.random().toString(36).substr(2, 9),
      email: formData.email,
      name: "John Traveler",
    })

    router.push("/dashboard")
  }

  return (
    <AuthLayout>
      <div className="mb-8 text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Globe className="w-8 h-8 text-primary" />
          <h1 className="text-2xl font-bold">Wanderlust</h1>
        </div>
        <p className="text-muted-foreground">Welcome back, traveler</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <InputField
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          placeholder="you@example.com"
        />

        <InputField
          label="Password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          placeholder="Your password"
        />

        <Button type="submit" disabled={loading} className="w-full">
          {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          {loading ? "Signing in..." : "Sign In"}
        </Button>
      </form>

      <div className="mt-6 space-y-4">
        <Link href="/auth/forgot-password" className="block text-center text-sm text-primary hover:underline">
          Forgot your password?
        </Link>

        <div className="pt-6 border-t border-border text-center">
          <p className="text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link href="/auth/signup" className="text-primary hover:underline font-semibold">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </AuthLayout>
  )
}

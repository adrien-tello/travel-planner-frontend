"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { AuthLayout } from "@/components/auth-layout"
import { InputField } from "@/components/input-field"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Globe, Loader2, ArrowLeft } from "lucide-react"

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!email) {
      setError("Email is required")
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Invalid email format")
      return
    }

    setLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setLoading(false)
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <AuthLayout>
        <div className="text-center space-y-6">
          <div>
            <h1 className="text-2xl font-bold mb-2">Check Your Email</h1>
            <p className="text-muted-foreground">We've sent a password reset link to {email}</p>
          </div>

          <div className="bg-muted p-4 rounded-lg">
            <p className="text-sm">
              Follow the link in the email to reset your password. The link will expire in 1 hour.
            </p>
          </div>

          <Button asChild variant="outline" className="w-full bg-transparent">
            <Link href="/auth/login" className="flex items-center justify-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Login
            </Link>
          </Button>
        </div>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout>
      <div className="mb-8 text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Globe className="w-8 h-8 text-primary" />
          <h1 className="text-2xl font-bold">Wanderlust</h1>
        </div>
        <p className="text-muted-foreground">Reset your password</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <InputField
          label="Email Address"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={error}
          placeholder="you@example.com"
        />

        <Button type="submit" disabled={loading} className="w-full">
          {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          {loading ? "Sending..." : "Send Reset Link"}
        </Button>
      </form>

      <div className="mt-6 pt-6 border-t border-border text-center">
        <Link
          href="/auth/login"
          className="text-sm text-primary hover:underline font-semibold flex items-center justify-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Login
        </Link>
      </div>
    </AuthLayout>
  )
}

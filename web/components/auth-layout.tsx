import type React from "react"
export function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-card rounded-xl border border-border shadow-lg p-8">{children}</div>
      </div>
    </div>
  )
}

"use client"
import { Badge } from "@/components/ui/badge"
import { DollarSign } from "lucide-react"

interface BudgetIndicatorProps {
  amount: number
  budget: "budget" | "moderate" | "luxury"
}

export function BudgetIndicator({ amount, budget }: BudgetIndicatorProps) {
  const getBudgetColor = () => {
    switch (budget) {
      case "budget":
        return "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
      case "moderate":
        return "bg-blue-500/10 text-blue-700 dark:text-blue-400"
      case "luxury":
        return "bg-orange-500/10 text-orange-700 dark:text-orange-400"
      default:
        return "bg-muted"
    }
  }

  return (
    <Badge className={`${getBudgetColor()} flex items-center gap-1 px-3 py-1.5`} variant="secondary">
      <DollarSign className="w-4 h-4" />
      <span className="capitalize">{budget}</span>
    </Badge>
  )
}

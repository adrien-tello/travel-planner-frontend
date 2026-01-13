"use client"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

interface SelectFieldProps {
  label?: string
  placeholder?: string
  value?: string
  onValueChange?: (value: string) => void
  error?: string
  disabled?: boolean
  options: Array<{ value: string; label: string }>
}

export function SelectField({ label, placeholder, value, onValueChange, error, disabled, options }: SelectFieldProps) {
  return (
    <div className="space-y-1.5">
      {label && <Label>{label}</Label>}
      <Select value={value} onValueChange={onValueChange} disabled={disabled}>
        <SelectTrigger className={error ? "border-destructive focus-visible:ring-destructive" : ""}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && <p className="text-sm font-medium text-destructive">{error}</p>}
    </div>
  )
}

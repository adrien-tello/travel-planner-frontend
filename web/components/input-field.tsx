"use client"

import * as React from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
}

export const InputField = React.forwardRef<HTMLInputElement, InputFieldProps>(
  ({ label, error, helperText, className, ...props }, ref) => (
    <div className="space-y-1.5">
      {label && <Label>{label}</Label>}
      <Input
        ref={ref}
        className={`${error ? "border-destructive focus-visible:ring-destructive" : ""} ${className || ""}`}
        {...props}
      />
      {error && <p className="text-sm font-medium text-destructive">{error}</p>}
      {helperText && <p className="text-sm text-muted-foreground">{helperText}</p>}
    </div>
  ),
)

InputField.displayName = "InputField"

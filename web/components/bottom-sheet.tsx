"use client"

import * as React from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface BottomSheetProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
}

export function BottomSheet({ isOpen, onClose, title, children }: BottomSheetProps) {
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
    }
    return () => {
      document.body.style.overflow = "auto"
    }
  }, [isOpen])

  return (
    <>
      {isOpen && <div className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm" onClick={onClose} />}

      <div
        className={`fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border rounded-t-2xl transition-transform duration-300 ${
          isOpen ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="max-h-[80vh] overflow-y-auto">
          <div className="sticky top-0 bg-card border-b border-border p-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">{title}</h2>
            <Button size="sm" variant="ghost" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
          <div className="p-4">{children}</div>
        </div>
      </div>
    </>
  )
}

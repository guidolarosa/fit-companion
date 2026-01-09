"use client"

import { useRouter } from "next/navigation"
import { ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { FittyButton } from "@/components/fitty-button"

interface PageHeaderProps {
  title: string
  showBackOnMobile?: boolean
  showFittyButton?: boolean
}

export function PageHeader({ title, showBackOnMobile = true, showFittyButton = true }: PageHeaderProps) {
  const router = useRouter()

  return (
    <div className="flex items-center justify-between mb-6 sm:mb-8">
      <div className="flex items-center gap-2">
        {showBackOnMobile && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="sm:hidden h-8 w-8 -ml-2"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
        )}
        <h1 className="text-2xl sm:text-3xl font-bold">{title}</h1>
      </div>
      {showFittyButton && <FittyButton />}
    </div>
  )
}

"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useTranslations } from "next-intl"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PaginationControlsProps {
  currentPage: number
  totalPages: number
  basePath: string
}

function getPageNumbers(currentPage: number, totalPages: number) {
  const pages: (number | string)[] = []
  const maxVisible = 5

  if (totalPages <= maxVisible) {
    for (let i = 1; i <= totalPages; i++) pages.push(i)
  } else {
    pages.push(1)
    if (currentPage > 3) pages.push("...")
    const start = Math.max(2, currentPage - 1)
    const end = Math.min(totalPages - 1, currentPage + 1)
    for (let i = start; i <= end; i++) pages.push(i)
    if (currentPage < totalPages - 2) pages.push("...")
    pages.push(totalPages)
  }

  return pages
}

export function PaginationControls({ currentPage, totalPages, basePath }: PaginationControlsProps) {
  const searchParams = useSearchParams()
  const tc = useTranslations("common")

  function createPageUrl(page: number) {
    const params = new URLSearchParams(searchParams.toString())
    params.set("page", page.toString())
    return `${basePath}?${params.toString()}`
  }

  if (totalPages <= 1) return null

  const pages = getPageNumbers(currentPage, totalPages)

  return (
    <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="text-sm text-muted-foreground">
        {tc("pageOf", { current: currentPage, total: totalPages })}
      </div>
      <div className="flex items-center gap-2">
        <Link href={createPageUrl(currentPage - 1)}>
          <Button variant="outline" size="sm" disabled={currentPage === 1} className="h-9 w-9 p-0">
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </Link>

        <div className="flex items-center gap-1">
          {pages.map((page, index) => {
            if (page === "...") {
              return (
                <span key={`ellipsis-${index}`} className="px-2 text-muted-foreground">
                  ...
                </span>
              )
            }
            const pageNum = page as number
            return (
              <Link key={pageNum} href={createPageUrl(pageNum)}>
                <Button
                  variant={currentPage === pageNum ? "default" : "outline"}
                  size="sm"
                  className="h-9 w-9 p-0"
                >
                  {pageNum}
                </Button>
              </Link>
            )
          })}
        </div>

        <Link href={createPageUrl(currentPage + 1)}>
          <Button variant="outline" size="sm" disabled={currentPage === totalPages} className="h-9 w-9 p-0">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  )
}

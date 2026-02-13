"use client"

import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DailyData } from "@/lib/daily-data"

interface AllDailyRegisterTableProps {
  dailyData: DailyData[]
  currentPage: number
  totalPages: number
}

export function AllDailyRegisterTable({ dailyData, currentPage, totalPages }: AllDailyRegisterTableProps) {
  const searchParams = useSearchParams()

  function createPageUrl(page: number) {
    const params = new URLSearchParams(searchParams.toString())
    params.set("page", page.toString())
    return `/register/all?${params.toString()}`
  }

  function getPageNumbers() {
    const pages: (number | string)[] = []
    const maxVisible = 5

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i)
        }
        pages.push("...")
        pages.push(totalPages)
      } else if (currentPage >= totalPages - 2) {
        pages.push(1)
        pages.push("...")
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i)
        }
      } else {
        pages.push(1)
        pages.push("...")
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i)
        }
        pages.push("...")
        pages.push(totalPages)
      }
    }

    return pages
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-[900px]">
          <thead>
            <tr className="border-b">
              <th className="text-left p-3 font-semibold">Date</th>
              <th className="text-right p-3 font-semibold">BMR</th>
              <th className="text-right p-3 font-semibold">TDEE</th>
              <th className="text-right p-3 font-semibold">Consumed</th>
              <th className="text-right p-3 font-semibold">Burnt</th>
              <th className="text-right p-3 font-semibold">Net</th>
              <th className="text-right p-3 font-semibold text-xs">Prot</th>
              <th className="text-right p-3 font-semibold text-xs">Carbs</th>
              <th className="text-right p-3 font-semibold text-xs">Fat</th>
              <th className="text-right p-3 font-semibold text-xs">Fiber</th>
              <th className="text-right p-3 font-semibold text-xs">Sugar</th>
            </tr>
          </thead>
          <tbody>
            {dailyData.map((day, index) => {
              const totalBurnt = day.tdee + day.caloriesBurnt;
              const netCalories = day.caloriesConsumed - totalBurnt;
              const netBadgeClass =
                netCalories < 0
                  ? "text-green-400 bg-green-400/10"
                  : netCalories > 0
                  ? "text-red-400 bg-red-400/10"
                  : "text-yellow-400 bg-yellow-400/10";
              
              const dateStr = new Date(day.date).toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric', 
                year: 'numeric', 
                timeZone: 'UTC' 
              });

              return (
                <tr key={index} className="border-b hover:bg-muted/50">
                  <td className="p-3 font-medium whitespace-nowrap">
                    {dateStr}
                  </td>
                  <td className="p-3 text-right text-muted-foreground whitespace-nowrap">
                    {day.bmr > 0 ? `${Math.round(day.bmr)}` : "-"}
                  </td>
                  <td className="p-3 text-right text-muted-foreground whitespace-nowrap">
                    {day.tdee > 0 ? `${Math.round(day.tdee)}` : "-"}
                  </td>
                  <td className="p-3 text-right whitespace-nowrap">
                    {Math.round(day.caloriesConsumed)}
                  </td>
                  <td className="p-3 text-right whitespace-nowrap">
                    {Math.round(day.caloriesBurnt)}
                  </td>
                  <td
                    className={`p-3 text-right font-semibold whitespace-nowrap ${
                      netCalories < 0
                        ? "text-green-400"
                        : netCalories > 0
                        ? "text-red-400"
                        : ""
                    }`}
                  >
                    {netCalories > 0 ? "+" : ""}
                    <span className={`${netBadgeClass} rounded-md px-2 py-1`}>
                      {Math.round(netCalories)}
                    </span>
                  </td>
                  <td className="p-3 text-right text-xs text-muted-foreground whitespace-nowrap">
                    {day.protein > 0 ? `${Math.round(day.protein)}g` : "-"}
                  </td>
                  <td className="p-3 text-right text-xs text-muted-foreground whitespace-nowrap">
                    {day.carbs > 0 ? `${Math.round(day.carbs)}g` : "-"}
                  </td>
                  <td className="p-3 text-right text-xs text-muted-foreground whitespace-nowrap">
                    {day.fat > 0 ? `${Math.round(day.fat)}g` : "-"}
                  </td>
                  <td className="p-3 text-right text-xs text-muted-foreground whitespace-nowrap">
                    {day.fiber > 0 ? `${Math.round(day.fiber)}g` : "-"}
                  </td>
                  <td className="p-3 text-right text-xs text-muted-foreground whitespace-nowrap">
                    {day.sugar > 0 ? `${Math.round(day.sugar)}g` : "-"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </div>
          <div className="flex items-center gap-2">
            <Link href={createPageUrl(currentPage - 1)}>
              <Button variant="outline" size="sm" disabled={currentPage === 1} className="h-9 w-9 p-0">
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </Link>

            <div className="flex items-center gap-1">
              {getPageNumbers().map((page, index) => {
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
      )}
    </>
  )
}

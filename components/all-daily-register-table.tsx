"use client"

import { DailyData } from "@/lib/daily-data"
import { PaginationControls } from "@/components/pagination-controls"
import { useTranslations } from "next-intl"

interface AllDailyRegisterTableProps {
  dailyData: DailyData[]
  currentPage: number
  totalPages: number
}

export function AllDailyRegisterTable({ dailyData, currentPage, totalPages }: AllDailyRegisterTableProps) {
  const t = useTranslations("report")
  const tc = useTranslations("common")

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-[900px]">
          <thead>
            <tr className="border-b">
              <th className="text-left p-3 font-semibold">{t("colDate")}</th>
              <th className="text-right p-3 font-semibold">{t("colBMR")}</th>
              <th className="text-right p-3 font-semibold">{t("colTDEE")}</th>
              <th className="text-right p-3 font-semibold">{t("colConsumed")}</th>
              <th className="text-right p-3 font-semibold">{t("colBurnt")}</th>
              <th className="text-right p-3 font-semibold">{t("colNet")}</th>
              <th className="text-right p-3 font-semibold text-xs">{tc("protShort")}</th>
              <th className="text-right p-3 font-semibold text-xs">{tc("carbsShort")}</th>
              <th className="text-right p-3 font-semibold text-xs">{tc("fatShort")}</th>
              <th className="text-right p-3 font-semibold text-xs">{tc("fiberShort")}</th>
              <th className="text-right p-3 font-semibold text-xs">{tc("sugarShort")}</th>
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

      <PaginationControls currentPage={currentPage} totalPages={totalPages} basePath="/register/all" />
    </>
  )
}

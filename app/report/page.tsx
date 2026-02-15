"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { Sidebar } from "@/components/sidebar"
import { MobileSidebar } from "@/components/mobile-sidebar"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { FileText, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { generateReportPDF, type ReportData } from "@/lib/report-pdf"
import { ReportDatePicker } from "@/components/report/ReportDatePicker"
import { ReportSummary } from "@/components/report/ReportSummary"
import { ReportCharts } from "@/components/report/ReportCharts"

export default function ReportPage() {
  const t = useTranslations("report")
  const tc = useTranslations("common")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [isFetching, setIsFetching] = useState(false)
  const [rangeType, setRangeType] = useState<"all" | "period">("period")
  const [reportData, setReportData] = useState<ReportData | null>(null)

  async function fetchReportData() {
    setIsFetching(true)
    try {
      let url = "/api/report"
      if (rangeType === "period") {
        if (!startDate || !endDate) {
          toast.error(t("selectDates"))
          setIsFetching(false)
          return
        }
        url += `?startDate=${startDate}&endDate=${endDate}`
      }

      const response = await fetch(url)
      if (!response.ok) throw new Error(t("fetchError"))

      const data: ReportData = await response.json()

      if (data.dailyData.length === 0) {
        toast.info(t("noData"))
        setReportData(null)
      } else {
        setReportData(data)
      }
    } catch (error) {
      console.error("Error fetching report data:", error)
      toast.error(t("loadError"))
    } finally {
      setIsFetching(false)
    }
  }

  async function handleGeneratePDF() {
    if (!reportData) return
    setIsGenerating(true)
    try {
      generateReportPDF({
        reportData,
        rangeType,
        startDate,
        endDate,
        translations: {
          pdfTitle: t("pdfTitle"),
          pdfFullHistory: t("pdfFullHistory"),
          pdfPeriodLabel: t("pdfPeriodLabel"),
          pdfGeneratedLabel: t("pdfGeneratedLabel"),
          pdfExecutiveSummary: t("pdfExecutiveSummary"),
          pdfKeyMetrics: t("pdfKeyMetrics"),
          pdfAvgDailyDeficit: t("pdfAvgDailyDeficit"),
          pdfAvgDailyIntake: t("pdfAvgDailyIntake"),
          pdfProjectedWeeklyChange: t("pdfProjectedWeeklyChange"),
          pdfCurrentStreak: t("pdfCurrentStreak"),
          pdfBestStreak: t("pdfBestStreak"),
          pdfDailyMacros: t("pdfDailyMacros"),
          pdfProtein: t("pdfProtein"),
          pdfCarbs: t("pdfCarbs"),
          pdfFat: t("pdfFat"),
          pdfFiber: t("pdfFiber"),
          pdfSugar: t("pdfSugar"),
          pdfDailyDataTitle: t("pdfDailyDataTitle"),
          colDate: t("colDate"),
          colBurnt: t("colBurnt"),
          pdfSuccess: t("pdfSuccess"),
          pdfError: t("pdfError"),
          days: tc("days"),
          deficit: tc("deficit"),
          maintenance: tc("maintenance"),
          surplus: tc("surplus"),
          kcal: tc("kcal"),
          kg: tc("kg"),
        },
      })
      toast.success(t("pdfSuccess"))
    } catch (error) {
      console.error("Error generating PDF:", error)
      toast.error(t("pdfError"))
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="flex h-screen">
      <Sidebar />
      <MobileSidebar />
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-5xl">
          <PageHeader title={t("title")} description={t("description")} />

          <ReportDatePicker
            rangeType={rangeType}
            onRangeTypeChange={setRangeType}
            startDate={startDate}
            onStartDateChange={setStartDate}
            endDate={endDate}
            onEndDateChange={setEndDate}
            isFetching={isFetching}
            onAnalyze={fetchReportData}
          />

          {reportData && (
            <div className="mt-8 space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
              <ReportSummary reportData={reportData} />
              <ReportCharts reportData={reportData} />

              <div className="flex justify-end">
                <Button
                  onClick={handleGeneratePDF}
                  disabled={isGenerating}
                  size="sm"
                  className="h-9 text-[10px] font-bold uppercase tracking-widest bg-zinc-800 text-white hover:bg-zinc-700"
                >
                  {isGenerating ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <FileText className="h-3.5 w-3.5 mr-2" />
                  )}
                  {t("exportPdf")}
                </Button>
              </div>
            </div>
          )}

          {!reportData && !isFetching && (
            <div className="mt-20 flex flex-col items-center justify-center text-center opacity-30">
              <FileText className="h-10 w-10 text-zinc-600 mb-4" />
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">
                {t("emptyState")}
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

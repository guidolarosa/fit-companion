"use client"

import { useState, useMemo } from "react"
import { useTranslations } from "next-intl"
import { Sidebar } from "@/components/sidebar"
import { MobileSidebar } from "@/components/mobile-sidebar"
import { PageHeader } from "@/components/page-header"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FileText, Loader2, TrendingDown, TrendingUp, Activity, Target, Flame, Calendar, Info, AlertCircle, ChevronRight } from "lucide-react"
import { toast } from "sonner"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell,
  PieChart,
  Pie,
} from "recharts"
import { cn } from "@/lib/utils"

// Type definitions for the API response
interface ReportData {
  dailyData: any[]
  exercises: any[]
  foods: any[]
  weights: any[]
  stats: {
    movingAvgWeight: (number | null)[]
    movingAvgCalories: (number | null)[]
    outliers: { date: string; reason: string }[]
    classification: {
      deficit: number
      maintenance: number
      surplus: number
    }
    streaks: {
      current: number
      best: number
    }
    narrative: string
    avgDeficit: number
    avgIntake: number
    projectedWeightChange: number
  }
}

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

  async function generatePDF() {
    if (!reportData) return
    setIsGenerating(true)
    try {
      const doc = new jsPDF()
      const title = t("pdfTitle")
      const period = rangeType === "all" 
        ? t("pdfFullHistory") 
        : `${new Date(startDate).toLocaleDateString('es-ES')} a ${new Date(endDate).toLocaleDateString('es-ES')}`

      doc.setFontSize(22)
      doc.setTextColor(249, 115, 22)
      doc.text(title, 14, 22)
      
      doc.setFontSize(11)
      doc.setTextColor(100)
      doc.text(`${t("pdfPeriodLabel")} ${period}`, 14, 30)
      doc.text(`${t("pdfGeneratedLabel")} ${new Date().toLocaleString('es-ES')}`, 14, 36)

      doc.setFontSize(14)
      doc.setTextColor(0)
      doc.text(t("pdfExecutiveSummary"), 14, 50)
      doc.setFontSize(11)
      doc.setTextColor(60)
      const splitNarrative = doc.splitTextToSize(reportData.stats.narrative, 180)
      doc.text(splitNarrative, 14, 58)

      const narrativeHeight = splitNarrative.length * 6
      let currentY = 58 + narrativeHeight + 10

      doc.setFontSize(14)
      doc.setTextColor(0)
      doc.text(t("pdfKeyMetrics"), 14, currentY)
      currentY += 8
      doc.setFontSize(11)
      doc.setTextColor(60)
      doc.text(`${t("pdfAvgDailyDeficit")} ${Math.round(reportData.stats.avgDeficit)} kcal`, 14, currentY)
      doc.text(`${t("pdfAvgDailyIntake")} ${Math.round(reportData.stats.avgIntake)} kcal`, 14, currentY + 6)
      doc.text(`${t("pdfProjectedWeeklyChange")} ${reportData.stats.projectedWeightChange.toFixed(2)} kg`, 14, currentY + 12)
      doc.text(`${t("pdfCurrentStreak")} ${reportData.stats.streaks.current} ${tc("days")}`, 100, currentY)
      doc.text(`${t("pdfBestStreak")} ${reportData.stats.streaks.best} ${tc("days")}`, 100, currentY + 6)

      currentY += 20

      // Macro averages
      const daysWithData = reportData.dailyData.length || 1
      const avgProtein = reportData.dailyData.reduce((s: number, d: any) => s + (d.protein || 0), 0) / daysWithData
      const avgCarbs = reportData.dailyData.reduce((s: number, d: any) => s + (d.carbs || 0), 0) / daysWithData
      const avgFat = reportData.dailyData.reduce((s: number, d: any) => s + (d.fat || 0), 0) / daysWithData
      const avgFiber = reportData.dailyData.reduce((s: number, d: any) => s + (d.fiber || 0), 0) / daysWithData
      const avgSugar = reportData.dailyData.reduce((s: number, d: any) => s + (d.sugar || 0), 0) / daysWithData

      doc.setFontSize(14)
      doc.setTextColor(0)
      doc.text(t("pdfDailyMacros"), 14, currentY)
      currentY += 8
      doc.setFontSize(11)
      doc.setTextColor(60)
      doc.text(`${t("pdfProtein")} ${Math.round(avgProtein)}g`, 14, currentY)
      doc.text(`${t("pdfCarbs")} ${Math.round(avgCarbs)}g`, 70, currentY)
      doc.text(`${t("pdfFat")} ${Math.round(avgFat)}g`, 140, currentY)
      currentY += 6
      doc.text(`${t("pdfFiber")} ${Math.round(avgFiber)}g`, 14, currentY)
      doc.text(`${t("pdfSugar")} ${Math.round(avgSugar)}g`, 70, currentY)

      currentY += 13

      const totalDays = reportData.stats.classification.deficit + reportData.stats.classification.maintenance + reportData.stats.classification.surplus
      const classRows = [
        [tc("deficit"), reportData.stats.classification.deficit, `${((reportData.stats.classification.deficit / (totalDays || 1)) * 100).toFixed(0)}%`],
        [tc("maintenance"), reportData.stats.classification.maintenance, `${((reportData.stats.classification.maintenance / (totalDays || 1)) * 100).toFixed(0)}%`],
        [tc("surplus"), reportData.stats.classification.surplus, `${((reportData.stats.classification.surplus / (totalDays || 1)) * 100).toFixed(0)}%`],
      ]

      autoTable(doc, {
        startY: currentY,
        head: [['Estado', tc("days"), '%']],
        body: classRows,
        theme: 'grid',
        headStyles: { fillColor: [249, 115, 22] },
        margin: { left: 14 },
        tableWidth: 80,
      })

      doc.addPage()
      doc.setFontSize(14)
      doc.setTextColor(0)
      doc.text(t("pdfDailyDataTitle"), 14, 20)

      const tableRows = reportData.dailyData.map((day) => {
        const dateStr = new Date(day.date).toLocaleDateString('es-ES', { 
          month: 'short', 
          day: 'numeric', 
          year: 'numeric',
          timeZone: 'UTC'
        })
        
        const dayExercises = reportData.exercises
          .filter(e => new Date(e.date).toISOString().split('T')[0] === day.date.split('T')[0])
          .map(e => e.name)
          .join(", ")

        const dayFoods = reportData.foods
          .filter(f => new Date(f.date).toISOString().split('T')[0] === day.date.split('T')[0])
          .map(f => f.name)
          .join(", ")

        const weight = day.weight ? `${day.weight} kg` : "-"

        return [
          dateStr,
          weight,
          Math.round(day.caloriesConsumed),
          Math.round(day.caloriesBurnt),
          day.protein ? Math.round(day.protein) : "-",
          day.carbs ? Math.round(day.carbs) : "-",
          day.fat ? Math.round(day.fat) : "-",
          day.fiber ? Math.round(day.fiber) : "-",
          day.sugar ? Math.round(day.sugar) : "-",
          dayFoods || "-",
          dayExercises || "-"
        ]
      })

      autoTable(doc, {
        startY: 30,
        head: [[t("colDate"), 'Peso', 'Kcal', t("colBurnt"), 'Prot(g)', 'Carbs(g)', 'Fat(g)', 'Fibra(g)', 'Azúcar(g)', 'Alimentos', 'Ejercicios']],
        body: tableRows,
        theme: 'striped',
        headStyles: { fillColor: [249, 115, 22], fontSize: 6.5 },
        styles: { fontSize: 6.5, cellPadding: 2 },
        columnStyles: {
          0: { cellWidth: 18 },
          1: { cellWidth: 14 },
          2: { cellWidth: 12 },
          3: { cellWidth: 12 },
          4: { cellWidth: 12 },
          5: { cellWidth: 12 },
          6: { cellWidth: 10 },
          7: { cellWidth: 12 },
          8: { cellWidth: 14 },
          9: { cellWidth: 36 },
          10: { cellWidth: 30 }
        },
        margin: { left: 8, right: 8 },
      })

      doc.save(`reporte-fit-companion-${new Date().toISOString().split('T')[0]}.pdf`)
      toast.success(t("pdfSuccess"))
    } catch (error) {
      console.error("Error generating PDF:", error)
      toast.error(t("pdfError"))
    } finally {
      setIsGenerating(false)
    }
  }

  const chartData = useMemo(() => {
    if (!reportData) return []
    return reportData.dailyData.map((day, idx) => ({
      date: new Date(day.date).toLocaleDateString('es-ES', { month: 'short', day: 'numeric', timeZone: 'UTC' }),
      weight: day.weight,
      movingAvgWeight: reportData.stats.movingAvgWeight[idx],
      calories: day.caloriesConsumed,
      movingAvgCalories: reportData.stats.movingAvgCalories[idx],
      net: day.netCalories,
      burnt: day.caloriesBurnt,
      protein: day.protein || 0,
      carbs: day.carbs || 0,
      fat: day.fat || 0,
      fiber: day.fiber || 0,
      sugar: day.sugar || 0,
    }))
  }, [reportData])

  const macroAverages = useMemo(() => {
    if (!reportData || reportData.dailyData.length === 0) return null
    const n = reportData.dailyData.length
    return {
      protein: Math.round(reportData.dailyData.reduce((s: number, d: any) => s + (d.protein || 0), 0) / n),
      carbs: Math.round(reportData.dailyData.reduce((s: number, d: any) => s + (d.carbs || 0), 0) / n),
      fat: Math.round(reportData.dailyData.reduce((s: number, d: any) => s + (d.fat || 0), 0) / n),
      fiber: Math.round(reportData.dailyData.reduce((s: number, d: any) => s + (d.fiber || 0), 0) / n),
      sugar: Math.round(reportData.dailyData.reduce((s: number, d: any) => s + (d.sugar || 0), 0) / n),
    }
  }, [reportData])

  const classificationData = useMemo(() => {
    if (!reportData) return []
    const { deficit, maintenance, surplus } = reportData.stats.classification
    return [
      { name: tc('deficit'), value: deficit, color: 'rgb(34 197 94)' },
      { name: tc('maintenance'), value: maintenance, color: 'rgb(161 161 170)' },
      { name: tc('surplus'), value: surplus, color: 'hsl(var(--primary))' },
    ]
  }, [reportData, tc])

  return (
    <div className="flex h-screen">
      <Sidebar />
      <MobileSidebar />
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-5xl">
          <PageHeader
            title={t("title")}
            description={t("description")}
          />

          <Card className="glass-card">
            <CardHeader className="pb-4">
              <CardTitle className="text-[10px] font-medium text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                <Calendar className="h-3.5 w-3.5 text-primary" />
                {t("configTitle")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="flex items-center space-x-1 p-1 bg-white/[0.03] rounded-md">
                  <div className={cn(
                    "px-4 py-1.5 rounded-sm cursor-pointer transition-all text-[10px] uppercase font-bold tracking-widest",
                    rangeType === "period" ? "bg-white/[0.05] text-primary" : "text-zinc-500 hover:text-zinc-300"
                  )} onClick={() => setRangeType("period")}>
                    {t("tabPeriod")}
                  </div>
                  <div className={cn(
                    "px-4 py-1.5 rounded-sm cursor-pointer transition-all text-[10px] uppercase font-bold tracking-widest",
                    rangeType === "all" ? "bg-white/[0.05] text-primary" : "text-zinc-500 hover:text-zinc-300"
                  )} onClick={() => setRangeType("all")}>
                    {t("tabAll")}
                  </div>
                </div>

                {rangeType === "period" && (
                  <div className="flex items-center gap-2">
                    <Input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="h-9 bg-white/[0.02] border-white/[0.05] text-xs text-zinc-300"
                    />
                    <span className="text-zinc-600">—</span>
                    <Input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="h-9 bg-white/[0.02] border-white/[0.05] text-xs text-zinc-300"
                    />
                  </div>
                )}

                <Button 
                  onClick={fetchReportData} 
                  disabled={isFetching}
                  className="w-full sm:w-auto ml-auto h-9 text-[10px] font-bold uppercase tracking-widest"
                >
                  {isFetching ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Activity className="h-3.5 w-3.5 mr-2" />}
                  {t("analyzeButton")}
                </Button>
              </div>
            </CardContent>
          </Card>

          {reportData && (
            <div className="mt-8 space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
              
              <Card className="glass-card border-l-primary border-l-2">
                <CardHeader className="pb-2">
                  <CardTitle className="text-[10px] font-medium text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                    <Info className="h-3.5 w-3.5 text-primary" />
                    {t("summaryTitle")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg font-medium leading-relaxed text-zinc-200 italic">
                    &ldquo;{reportData.stats.narrative}&rdquo;
                  </p>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="glass-card">
                  <CardContent className="pt-6">
                    <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-500">{t("dailyDeficit")}</p>
                    <h3 className="text-2xl font-bold text-white mt-1">
                      {Math.round(reportData.stats.avgDeficit)} <span className="text-[10px] text-zinc-600 uppercase">{tc("kcal")}</span>
                    </h3>
                  </CardContent>
                </Card>

                <Card className="glass-card">
                  <CardContent className="pt-6">
                    <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-500">{t("projectedChange")}</p>
                    <h3 className="text-2xl font-bold text-white mt-1">
                      {reportData.stats.projectedWeightChange > 0 ? "+" : ""}
                      {reportData.stats.projectedWeightChange.toFixed(2)} <span className="text-[10px] text-zinc-600 uppercase">{tc("kg")}</span>
                    </h3>
                  </CardContent>
                </Card>

                <Card className="glass-card">
                  <CardContent className="pt-6">
                    <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-500">{t("currentStreak")}</p>
                    <h3 className="text-2xl font-bold text-white mt-1">
                      {reportData.stats.streaks.current} <span className="text-[10px] text-zinc-600 uppercase">{tc("days")}</span>
                    </h3>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle className="text-[9px] font-bold uppercase tracking-widest text-zinc-600">{t("chartWeightTrend")}</CardTitle>
                  </CardHeader>
                  <CardContent className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
                        <XAxis dataKey="date" fontSize={9} axisLine={false} tickLine={false} tick={{ fill: 'rgb(82 82 91)' }} />
                        <YAxis hide domain={['auto', 'auto']} />
                        <Tooltip contentStyle={{ backgroundColor: 'rgb(9 9 11)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '4px', fontSize: '10px' }} />
                        <Line type="monotone" dataKey="weight" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 3, fill: 'hsl(var(--primary))', strokeWidth: 0 }} name={t("chartWeight")} connectNulls />
                        <Line type="monotone" dataKey="movingAvgWeight" stroke="#9333ea" strokeWidth={1.5} dot={false} strokeDasharray="4 4" name={t("chartAverage")} connectNulls />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle className="text-[9px] font-bold uppercase tracking-widest text-zinc-600">{t("chartCaloricIntake")}</CardTitle>
                  </CardHeader>
                  <CardContent className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
                        <XAxis dataKey="date" fontSize={9} axisLine={false} tickLine={false} tick={{ fill: 'rgb(82 82 91)' }} />
                        <YAxis hide />
                        <Tooltip contentStyle={{ backgroundColor: 'rgb(9 9 11)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '4px', fontSize: '10px' }} />
                        <Bar dataKey="calories" fill="rgba(249, 115, 22, 0.2)" name={t("chartIntake")} />
                        <Line type="monotone" dataKey="movingAvgCalories" stroke="#facc15" strokeWidth={1.5} dot={false} name={t("chartAverage")} />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>

              {/* Macro Averages */}
              {macroAverages && (
                <>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                    {[
                      { key: "protein", label: tc("protein"), value: macroAverages.protein, unit: tc("g"), color: "text-blue-400" },
                      { key: "carbs", label: tc("carbs"), value: macroAverages.carbs, unit: tc("g"), color: "text-amber-400" },
                      { key: "fat", label: tc("fat"), value: macroAverages.fat, unit: tc("g"), color: "text-rose-400" },
                      { key: "fiber", label: tc("fiber"), value: macroAverages.fiber, unit: tc("g"), color: "text-emerald-400" },
                      { key: "sugar", label: tc("sugar"), value: macroAverages.sugar, unit: tc("g"), color: "text-purple-400" },
                    ].map((m) => (
                      <Card key={m.key} className="glass-card">
                        <CardContent className="pt-4 pb-3 px-4">
                          <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-500">{m.label}</p>
                          <h3 className={cn("text-xl font-bold mt-1", m.color)}>
                            {m.value} <span className="text-[10px] text-zinc-600">{m.unit}{tc("perDay")}</span>
                          </h3>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  <Card className="glass-card">
                    <CardHeader>
                      <CardTitle className="text-[9px] font-bold uppercase tracking-widest text-zinc-600">{t("chartMacrosPerDay")}</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[280px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
                          <XAxis dataKey="date" fontSize={9} axisLine={false} tickLine={false} tick={{ fill: 'rgb(82 82 91)' }} />
                          <YAxis hide />
                          <Tooltip 
                            contentStyle={{ backgroundColor: 'rgb(9 9 11)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '4px', fontSize: '10px' }}
                            formatter={(value: number, name: string) => [`${Math.round(value)}g`, name]}
                          />
                          <Legend wrapperStyle={{ fontSize: '10px' }} />
                          <Bar dataKey="protein" stackId="macros" fill="rgb(96 165 250)" name={tc("protein")} />
                          <Bar dataKey="carbs" stackId="macros" fill="rgb(251 191 36)" name={tc("carbs")} />
                          <Bar dataKey="fat" stackId="macros" fill="rgb(251 113 133)" name={tc("fat")} />
                          <Bar dataKey="fiber" stackId="macros" fill="rgb(52 211 153)" name={tc("fiber")} radius={[2, 2, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </>
              )}

              <div className="flex justify-end">
                <Button 
                  onClick={generatePDF} 
                  disabled={isGenerating}
                  size="sm"
                  className="h-9 text-[10px] font-bold uppercase tracking-widest bg-zinc-800 text-white hover:bg-zinc-700"
                >
                  {isGenerating ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <FileText className="h-3.5 w-3.5 mr-2" />}
                  {t("exportPdf")}
                </Button>
              </div>

            </div>
          )}

          {!reportData && !isFetching && (
            <div className="mt-20 flex flex-col items-center justify-center text-center opacity-30">
              <FileText className="h-10 w-10 text-zinc-600 mb-4" />
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">{t("emptyState")}</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

"use client"

import { useState, useMemo } from "react"
import { Sidebar } from "@/components/sidebar"
import { MobileSidebar } from "@/components/mobile-sidebar"
import { PageHeader } from "@/components/page-header"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FileText, Loader2, TrendingDown, TrendingUp, Minus, Activity, Target, Flame, Calendar, Info, AlertCircle } from "lucide-react"
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
          toast.error("Please select both start and end dates")
          setIsFetching(false)
          return
        }
        url += `?startDate=${startDate}&endDate=${endDate}`
      }

      const response = await fetch(url)
      if (!response.ok) throw new Error("Failed to fetch report data")
      
      const data: ReportData = await response.json()
      
      if (data.dailyData.length === 0) {
        toast.info("No data found for the selected period")
        setReportData(null)
      } else {
        setReportData(data)
      }
    } catch (error) {
      console.error("Error fetching report data:", error)
      toast.error("Failed to fetch report data")
    } finally {
      setIsFetching(false)
    }
  }

  async function generatePDF() {
    if (!reportData) return
    setIsGenerating(true)
    try {
      const doc = new jsPDF()
      const title = "Fit Companion - Reporting & Insights"
      const period = rangeType === "all" 
        ? "All Time" 
        : `${new Date(startDate).toLocaleDateString()} to ${new Date(endDate).toLocaleDateString()}`

      // Header
      doc.setFontSize(22)
      doc.setTextColor(59, 130, 246) // Blue 500
      doc.text(title, 14, 22)
      
      doc.setFontSize(11)
      doc.setTextColor(100)
      doc.text(`Period: ${period}`, 14, 30)
      doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 36)

      // Narrative Summary
      doc.setFontSize(14)
      doc.setTextColor(0)
      doc.text("Executive Summary", 14, 50)
      doc.setFontSize(11)
      doc.setTextColor(60)
      const splitNarrative = doc.splitTextToSize(reportData.stats.narrative, 180)
      doc.text(splitNarrative, 14, 58)

      const narrativeHeight = splitNarrative.length * 6
      let currentY = 58 + narrativeHeight + 10

      // Key Metrics
      doc.setFontSize(14)
      doc.setTextColor(0)
      doc.text("Key Metrics", 14, currentY)
      currentY += 8
      doc.setFontSize(11)
      doc.setTextColor(60)
      doc.text(`Average Daily Deficit: ${Math.round(reportData.stats.avgDeficit)} kcal`, 14, currentY)
      doc.text(`Average Daily Intake: ${Math.round(reportData.stats.avgIntake)} kcal`, 14, currentY + 6)
      doc.text(`Projected Weekly Change: ${reportData.stats.projectedWeightChange.toFixed(2)} kg`, 14, currentY + 12)
      doc.text(`Current Streak: ${reportData.stats.streaks.current} days`, 100, currentY)
      doc.text(`Best Streak: ${reportData.stats.streaks.best} days`, 100, currentY + 6)

      currentY += 25

      // Classification Table
      const totalDays = reportData.stats.classification.deficit + reportData.stats.classification.maintenance + reportData.stats.classification.surplus
      const classRows = [
        ["Deficit", reportData.stats.classification.deficit, `${((reportData.stats.classification.deficit / totalDays) * 100).toFixed(0)}%`],
        ["Maintenance", reportData.stats.classification.maintenance, `${((reportData.stats.classification.maintenance / totalDays) * 100).toFixed(0)}%`],
        ["Surplus", reportData.stats.classification.surplus, `${((reportData.stats.classification.surplus / totalDays) * 100).toFixed(0)}%`],
      ]

      autoTable(doc, {
        startY: currentY,
        head: [['State', 'Days', 'Percentage']],
        body: classRows,
        theme: 'grid',
        headStyles: { fillColor: [59, 130, 246] },
        margin: { left: 14 },
        tableWidth: 80,
      })

      // Outliers if any
      if (reportData.stats.outliers.length > 0) {
        doc.setFontSize(14)
        doc.setTextColor(0)
        doc.text("Atypical Days (Outliers)", 100, currentY + 5)
        doc.setFontSize(9)
        doc.setTextColor(60)
        reportData.stats.outliers.slice(0, 5).forEach((outlier, idx) => {
          doc.text(`• ${outlier.date}: ${outlier.reason}`, 100, currentY + 12 + (idx * 5))
        })
      }

      // Day by Day Table (on next page)
      doc.addPage()
      doc.setFontSize(14)
      doc.setTextColor(0)
      doc.text("Daily Data Log", 14, 20)

      const tableRows = reportData.dailyData.map((day) => {
        const dateStr = new Date(day.date).toLocaleDateString('en-US', { 
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
          dayFoods || "-",
          dayExercises || "-"
        ]
      })

      autoTable(doc, {
        startY: 30,
        head: [['Date', 'Weight', 'Consumed', 'Burnt', 'Food Items', 'Exercises']],
        body: tableRows,
        theme: 'striped',
        headStyles: { fillColor: [59, 130, 246] },
        styles: { fontSize: 8 },
        columnStyles: {
          4: { cellWidth: 40 },
          5: { cellWidth: 40 }
        }
      })

      doc.save(`fit-companion-v2-report-${new Date().toISOString().split('T')[0]}.pdf`)
      toast.success("Report generated successfully!")
    } catch (error) {
      console.error("Error generating PDF:", error)
      toast.error("Failed to generate report")
    } finally {
      setIsGenerating(false)
    }
  }

  const chartData = useMemo(() => {
    if (!reportData) return []
    return reportData.dailyData.map((day, idx) => ({
      date: new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' }),
      weight: day.weight,
      movingAvgWeight: reportData.stats.movingAvgWeight[idx],
      calories: day.caloriesConsumed,
      movingAvgCalories: reportData.stats.movingAvgCalories[idx],
      net: day.netCalories,
      burnt: day.caloriesBurnt
    }))
  }, [reportData])

  const classificationData = useMemo(() => {
    if (!reportData) return []
    const { deficit, maintenance, surplus } = reportData.stats.classification
    return [
      { name: 'Déficit', value: deficit, color: '#4ade80' },
      { name: 'Mantenimiento', value: maintenance, color: '#facc15' },
      { name: 'Superávit', value: surplus, color: '#f87171' },
    ]
  }, [reportData])

  return (
    <div className="flex h-screen">
      <Sidebar />
      <MobileSidebar />
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-5xl">
          <PageHeader
            title="Reporting & Insights"
            description="Visualiza tus tendencias y obtén un análisis detallado de tu progreso."
          />

          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Configuración del Reporte
              </CardTitle>
              <CardDescription>
                Selecciona el período para generar insights y gráficos.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="period"
                      name="rangeType"
                      checked={rangeType === "period"}
                      onChange={() => setRangeType("period")}
                      className="h-4 w-4 text-primary"
                    />
                    <Label htmlFor="period">Período</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="all"
                      name="rangeType"
                      checked={rangeType === "all"}
                      onChange={() => setRangeType("all")}
                      className="h-4 w-4 text-primary"
                    />
                    <Label htmlFor="all">Todo</Label>
                  </div>
                </div>

                {rangeType === "period" && (
                  <div className="flex items-center gap-4 flex-1">
                    <Input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="max-w-[180px]"
                    />
                    <span className="text-muted-foreground">a</span>
                    <Input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="max-w-[180px]"
                    />
                  </div>
                )}

                <Button 
                  onClick={fetchReportData} 
                  disabled={isFetching}
                  className="w-full sm:w-auto ml-auto"
                >
                  {isFetching ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Cargando...
                    </>
                  ) : (
                    <>
                      <Activity className="mr-2 h-4 w-4" />
                      Analizar Datos
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {reportData && (
            <div className="mt-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              
              {/* Narrative Summary */}
              <Card className="border-primary/20 bg-primary/5">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Info className="h-5 w-5 text-primary" />
                    Resumen del Período
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg leading-relaxed text-foreground/90">
                    {reportData.stats.narrative}
                  </p>
                </CardContent>
              </Card>

              {/* Summary Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                        <Flame className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className={cn(
                        "flex items-center text-sm font-medium",
                        reportData.stats.avgDeficit < 0 ? "text-green-500" : "text-red-500"
                      )}>
                        {reportData.stats.avgDeficit < 0 ? <TrendingDown className="h-4 w-4 mr-1" /> : <TrendingUp className="h-4 w-4 mr-1" />}
                        {Math.abs(reportData.stats.avgDeficit).toFixed(0)} kcal
                      </div>
                    </div>
                    <div className="mt-4">
                      <p className="text-sm text-muted-foreground">Déficit Promedio</p>
                      <h3 className="text-2xl font-bold">{Math.round(reportData.stats.avgDeficit)} kcal/día</h3>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                        <Target className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div className="text-sm font-medium text-muted-foreground">
                        {reportData.stats.projectedWeightChange < 0 ? "Proyectado" : "Estimado"}
                      </div>
                    </div>
                    <div className="mt-4">
                      <p className="text-sm text-muted-foreground">Cambio Semanal</p>
                      <h3 className="text-2xl font-bold">
                        {reportData.stats.projectedWeightChange > 0 ? "+" : ""}
                        {reportData.stats.projectedWeightChange.toFixed(2)} kg
                      </h3>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                        <Calendar className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                      </div>
                      <div className="text-sm font-medium text-green-500">
                        Mejor: {reportData.stats.streaks.best} d
                      </div>
                    </div>
                    <div className="mt-4">
                      <p className="text-sm text-muted-foreground">Racha Actual</p>
                      <h3 className="text-2xl font-bold">{reportData.stats.streaks.current} días</h3>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Charts Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Weight Trend */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-md">Tendencia de Peso</CardTitle>
                    <CardDescription>Peso diario vs Media móvil (7 días)</CardDescription>
                  </CardHeader>
                  <CardContent className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#88888844" />
                        <XAxis dataKey="date" fontSize={10} tickMargin={10} />
                        <YAxis hide domain={['auto', 'auto']} />
                        <Tooltip />
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey="weight" 
                          stroke="#3b82f6" 
                          strokeWidth={2} 
                          dot={{ r: 3 }} 
                          name="Peso Real"
                          connectNulls
                        />
                        <Line 
                          type="monotone" 
                          dataKey="movingAvgWeight" 
                          stroke="#9333ea" 
                          strokeWidth={2} 
                          dot={false} 
                          strokeDasharray="5 5"
                          name="Media Móvil"
                          connectNulls
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Calories Distribution */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-md">Consumo de Calorías</CardTitle>
                    <CardDescription>Ingesta diaria vs Promedio móvil</CardDescription>
                  </CardHeader>
                  <CardContent className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#88888844" />
                        <XAxis dataKey="date" fontSize={10} tickMargin={10} />
                        <YAxis hide />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="calories" fill="#3b82f688" name="Consumo" radius={[4, 4, 0, 0]} />
                        <Line 
                          type="monotone" 
                          dataKey="movingAvgCalories" 
                          stroke="#f59e0b" 
                          strokeWidth={2} 
                          dot={false} 
                          name="Promedio Semanal"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>

              {/* Insights Section */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Classification Donut */}
                <Card className="lg:col-span-1">
                  <CardHeader>
                    <CardTitle className="text-md">Distribución del Período</CardTitle>
                  </CardHeader>
                  <CardContent className="h-[250px] flex flex-col items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={classificationData}
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {classificationData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Outliers and Alerts */}
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle className="text-md">Días Atípicos e Insights</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {reportData.stats.outliers.length > 0 ? (
                        reportData.stats.outliers.map((outlier, idx) => (
                          <div key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-100 dark:border-yellow-900">
                            <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                            <div>
                              <p className="text-sm font-semibold">{outlier.date}</p>
                              <p className="text-sm text-yellow-700 dark:text-yellow-300">{outlier.reason}</p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-muted-foreground italic">No se detectaron días atípicos significativos.</p>
                      )}

                      {/* Soft Alerts */}
                      {reportData.stats.avgIntake < 1200 && (
                        <div className="flex items-start gap-3 p-3 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900">
                          <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                          <p className="text-sm text-blue-700 dark:text-blue-300">
                            Llevás varios días comiendo muy poco. A veces un pequeño ajuste ayuda a sostener el progreso.
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end pt-4">
                <Button 
                  onClick={generatePDF} 
                  disabled={isGenerating}
                  size="lg"
                  className="w-full sm:w-auto"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generando PDF...
                    </>
                  ) : (
                    <>
                      <FileText className="mr-2 h-4 w-4" />
                      Descargar Reporte PDF
                    </>
                  )}
                </Button>
              </div>

            </div>
          )}

          {!reportData && !isFetching && (
            <Card className="mt-8 border-dashed">
              <CardContent className="py-12 flex flex-col items-center justify-center text-center">
                <FileText className="h-12 w-12 text-muted-foreground mb-4 opacity-20" />
                <h3 className="text-lg font-medium text-muted-foreground">Sin datos para mostrar</h3>
                <p className="text-sm text-muted-foreground max-w-sm mt-1">
                  Selecciona un período y haz clic en &quot;Analizar Datos&quot; para ver tus tendencias e insights.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}

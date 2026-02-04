"use client"

import { useState, useMemo } from "react"
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
          toast.error("Por favor, selecciona fechas de inicio y fin")
          setIsFetching(false)
          return
        }
        url += `?startDate=${startDate}&endDate=${endDate}`
      }

      const response = await fetch(url)
      if (!response.ok) throw new Error("Error al obtener los datos del reporte")
      
      const data: ReportData = await response.json()
      
      if (data.dailyData.length === 0) {
        toast.info("No se encontraron datos para el período seleccionado")
        setReportData(null)
      } else {
        setReportData(data)
      }
    } catch (error) {
      console.error("Error fetching report data:", error)
      toast.error("Error al cargar los datos")
    } finally {
      setIsFetching(false)
    }
  }

  async function generatePDF() {
    if (!reportData) return
    setIsGenerating(true)
    try {
      const doc = new jsPDF()
      const title = "Fit Companion - Reporte de Progreso"
      const period = rangeType === "all" 
        ? "Historial Completo" 
        : `${new Date(startDate).toLocaleDateString('es-ES')} a ${new Date(endDate).toLocaleDateString('es-ES')}`

      doc.setFontSize(22)
      doc.setTextColor(249, 115, 22) // Primary Orange
      doc.text(title, 14, 22)
      
      doc.setFontSize(11)
      doc.setTextColor(100)
      doc.text(`Período: ${period}`, 14, 30)
      doc.text(`Generado el: ${new Date().toLocaleString('es-ES')}`, 14, 36)

      doc.setFontSize(14)
      doc.setTextColor(0)
      doc.text("Resumen Ejecutivo", 14, 50)
      doc.setFontSize(11)
      doc.setTextColor(60)
      const splitNarrative = doc.splitTextToSize(reportData.stats.narrative, 180)
      doc.text(splitNarrative, 14, 58)

      const narrativeHeight = splitNarrative.length * 6
      let currentY = 58 + narrativeHeight + 10

      doc.setFontSize(14)
      doc.setTextColor(0)
      doc.text("Métricas Clave", 14, currentY)
      currentY += 8
      doc.setFontSize(11)
      doc.setTextColor(60)
      doc.text(`Déficit Diario Promedio: ${Math.round(reportData.stats.avgDeficit)} kcal`, 14, currentY)
      doc.text(`Consumo Diario Promedio: ${Math.round(reportData.stats.avgIntake)} kcal`, 14, currentY + 6)
      doc.text(`Cambio Semanal Proyectado: ${reportData.stats.projectedWeightChange.toFixed(2)} kg`, 14, currentY + 12)
      doc.text(`Racha Actual: ${reportData.stats.streaks.current} días`, 100, currentY)
      doc.text(`Mejor Racha: ${reportData.stats.streaks.best} días`, 100, currentY + 6)

      currentY += 25

      const totalDays = reportData.stats.classification.deficit + reportData.stats.classification.maintenance + reportData.stats.classification.surplus
      const classRows = [
        ["Déficit", reportData.stats.classification.deficit, `${((reportData.stats.classification.deficit / (totalDays || 1)) * 100).toFixed(0)}%`],
        ["Mantenimiento", reportData.stats.classification.maintenance, `${((reportData.stats.classification.maintenance / (totalDays || 1)) * 100).toFixed(0)}%`],
        ["Superávit", reportData.stats.classification.surplus, `${((reportData.stats.classification.surplus / (totalDays || 1)) * 100).toFixed(0)}%`],
      ]

      autoTable(doc, {
        startY: currentY,
        head: [['Estado', 'Días', 'Porcentaje']],
        body: classRows,
        theme: 'grid',
        headStyles: { fillColor: [249, 115, 22] },
        margin: { left: 14 },
        tableWidth: 80,
      })

      if (reportData.stats.outliers.length > 0) {
        doc.setFontSize(14)
        doc.setTextColor(0)
        doc.text("Días Atípicos", 100, currentY + 5)
        doc.setFontSize(9)
        doc.setTextColor(60)
        reportData.stats.outliers.slice(0, 5).forEach((outlier, idx) => {
          doc.text(`• ${outlier.date}: ${outlier.reason}`, 100, currentY + 12 + (idx * 5))
        })
      }

      doc.addPage()
      doc.setFontSize(14)
      doc.setTextColor(0)
      doc.text("Registro Diario de Datos", 14, 20)

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
          dayFoods || "-",
          dayExercises || "-"
        ]
      })

      autoTable(doc, {
        startY: 30,
        head: [['Fecha', 'Peso', 'Consumo', 'Gasto', 'Alimentos', 'Ejercicios']],
        body: tableRows,
        theme: 'striped',
        headStyles: { fillColor: [249, 115, 22] },
        styles: { fontSize: 8 },
        columnStyles: {
          4: { cellWidth: 40 },
          5: { cellWidth: 40 }
        }
      })

      doc.save(`reporte-fit-companion-${new Date().toISOString().split('T')[0]}.pdf`)
      toast.success("¡Reporte generado con éxito!")
    } catch (error) {
      console.error("Error generating PDF:", error)
      toast.error("Error al generar el reporte")
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
      burnt: day.caloriesBurnt
    }))
  }, [reportData])

  const classificationData = useMemo(() => {
    if (!reportData) return []
    const { deficit, maintenance, surplus } = reportData.stats.classification
    return [
      { name: 'Déficit', value: deficit, color: 'hsl(var(--secondary))' },
      { name: 'Mantenimiento', value: maintenance, color: '#facc15' },
      { name: 'Superávit', value: surplus, color: 'hsl(var(--primary))' },
    ]
  }, [reportData])

  return (
    <div className="flex h-screen">
      <Sidebar />
      <MobileSidebar />
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-5xl">
          <PageHeader
            title="Reportes e Insights"
            description="Visualiza tus tendencias y obtén un análisis detallado de tu progreso."
          />

          <Card className="mt-8 glass-card border-none overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary opacity-50" />
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-heading uppercase tracking-wider text-slate-400">
                <Calendar className="h-5 w-5 text-primary" />
                Configuración del Reporte
              </CardTitle>
              <CardDescription className="text-slate-500">
                Selecciona el período para generar insights y gráficos.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="flex items-center space-x-6 p-1 bg-white/5 rounded-xl border border-white/5">
                  <div className={cn(
                    "flex items-center space-x-2 px-4 py-2 rounded-lg cursor-pointer transition-all",
                    rangeType === "period" ? "bg-primary text-white shadow-lg" : "text-slate-400 hover:text-slate-200"
                  )} onClick={() => setRangeType("period")}>
                    <input type="radio" checked={rangeType === "period"} readOnly className="hidden" />
                    <Label className="cursor-pointer font-heading font-bold uppercase tracking-widest text-[10px]">Período</Label>
                  </div>
                  <div className={cn(
                    "flex items-center space-x-2 px-4 py-2 rounded-lg cursor-pointer transition-all",
                    rangeType === "all" ? "bg-primary text-white shadow-lg" : "text-slate-400 hover:text-slate-200"
                  )} onClick={() => setRangeType("all")}>
                    <input type="radio" checked={rangeType === "all"} readOnly className="hidden" />
                    <Label className="cursor-pointer font-heading font-bold uppercase tracking-widest text-[10px]">Todo</Label>
                  </div>
                </div>

                {rangeType === "period" && (
                  <div className="flex items-center gap-3 flex-1 bg-white/5 p-1 rounded-xl border border-white/5">
                    <Input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="bg-transparent border-none focus-visible:ring-0 h-10 font-heading font-bold text-slate-200"
                    />
                    <ChevronRight className="h-4 w-4 text-slate-600" />
                    <Input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="bg-transparent border-none focus-visible:ring-0 h-10 font-heading font-bold text-slate-200"
                    />
                  </div>
                )}

                <Button 
                  onClick={fetchReportData} 
                  disabled={isFetching}
                  className="w-full sm:w-auto ml-auto btn-hover rounded-xl px-8 h-12 font-heading font-bold uppercase tracking-widest"
                >
                  {isFetching ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Activity className="mr-2 h-4 w-4" />}
                  Analizar
                </Button>
              </div>
            </CardContent>
          </Card>

          {reportData && (
            <div className="mt-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
              
              <Card className="glass-card border-none overflow-hidden group">
                <div className="absolute top-0 left-0 w-1 h-full bg-primary opacity-50" />
                <CardHeader>
                  <CardTitle className="text-sm font-heading font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                    <Info className="h-4 w-4 text-primary" />
                    Resumen del Período
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xl font-heading font-bold leading-relaxed text-slate-100 italic">
                    &ldquo;{reportData.stats.narrative}&rdquo;
                  </p>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="glass-card border-none overflow-hidden">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div className="p-3 bg-primary/10 rounded-xl">
                        <Flame className="h-6 w-6 text-primary" />
                      </div>
                      <div className={cn(
                        "font-heading font-bold text-xs uppercase tracking-widest px-2 py-1 rounded-full bg-white/5",
                        reportData.stats.avgDeficit < 0 ? "text-secondary" : "text-primary"
                      )}>
                        {reportData.stats.avgDeficit < 0 ? "Déficit" : "Superávit"}
                      </div>
                    </div>
                    <div className="mt-6">
                      <p className="text-[10px] font-heading font-bold uppercase tracking-widest text-slate-500">Déficit Diario Promedio</p>
                      <h3 className="text-3xl font-heading font-bold text-slate-50 mt-1">
                        {Math.round(reportData.stats.avgDeficit)} <span className="text-sm text-slate-500 uppercase">kcal</span>
                      </h3>
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass-card border-none overflow-hidden">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div className="p-3 bg-secondary/10 rounded-xl">
                        <Target className="h-6 w-6 text-secondary" />
                      </div>
                      <div className="font-heading font-bold text-xs uppercase tracking-widest text-slate-500">Semanal</div>
                    </div>
                    <div className="mt-6">
                      <p className="text-[10px] font-heading font-bold uppercase tracking-widest text-slate-500">Cambio Proyectado</p>
                      <h3 className="text-3xl font-heading font-bold text-slate-50 mt-1">
                        {reportData.stats.projectedWeightChange > 0 ? "+" : ""}
                        {reportData.stats.projectedWeightChange.toFixed(2)} <span className="text-sm text-slate-500 uppercase">kg</span>
                      </h3>
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass-card border-none overflow-hidden">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div className="p-3 bg-blue-500/10 rounded-xl">
                        <Calendar className="h-6 w-6 text-blue-400" />
                      </div>
                      <div className="font-heading font-bold text-xs uppercase tracking-widest text-secondary">Mejor: {reportData.stats.streaks.best} d</div>
                    </div>
                    <div className="mt-6">
                      <p className="text-[10px] font-heading font-bold uppercase tracking-widest text-slate-500">Racha Actual</p>
                      <h3 className="text-3xl font-heading font-bold text-slate-50 mt-1">
                        {reportData.stats.streaks.current} <span className="text-sm text-slate-500 uppercase">días</span>
                      </h3>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="glass-card border-none overflow-hidden">
                  <CardHeader>
                    <CardTitle className="text-xs font-heading font-bold uppercase tracking-widest text-slate-500">Tendencia de Peso</CardTitle>
                  </CardHeader>
                  <CardContent className="h-[300px] pt-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                        <XAxis dataKey="date" fontSize={10} tickMargin={10} axisLine={false} tickLine={false} />
                        <YAxis hide domain={['auto', 'auto']} />
                        <Tooltip contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }} />
                        <Legend iconType="circle" />
                        <Line type="monotone" dataKey="weight" stroke="hsl(var(--primary))" strokeWidth={3} dot={{ r: 4, fill: 'hsl(var(--primary))', strokeWidth: 0 }} name="Peso Real" connectNulls />
                        <Line type="monotone" dataKey="movingAvgWeight" stroke="#9333ea" strokeWidth={2} dot={false} strokeDasharray="5 5" name="Media Móvil" connectNulls />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card className="glass-card border-none overflow-hidden">
                  <CardHeader>
                    <CardTitle className="text-xs font-heading font-bold uppercase tracking-widest text-slate-500">Consumo de Calorías</CardTitle>
                  </CardHeader>
                  <CardContent className="h-[300px] pt-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                        <XAxis dataKey="date" fontSize={10} tickMargin={10} axisLine={false} tickLine={false} />
                        <YAxis hide />
                        <Tooltip contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }} />
                        <Legend iconType="circle" />
                        <Bar dataKey="calories" fill="rgba(249, 115, 22, 0.3)" name="Consumo" radius={[4, 4, 0, 0]} />
                        <Line type="monotone" dataKey="movingAvgCalories" stroke="#facc15" strokeWidth={2} dot={false} name="Promedio Semanal" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Card className="lg:col-span-1 glass-card border-none overflow-hidden">
                  <CardHeader>
                    <CardTitle className="text-xs font-heading font-bold uppercase tracking-widest text-slate-500">Distribución del Período</CardTitle>
                  </CardHeader>
                  <CardContent className="h-[250px] flex flex-col items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={classificationData} innerRadius={60} outerRadius={80} paddingAngle={8} dataKey="value" stroke="none">
                          {classificationData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                        </Pie>
                        <Tooltip />
                        <Legend verticalAlign="bottom" align="center" />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card className="lg:col-span-2 glass-card border-none overflow-hidden">
                  <CardHeader>
                    <CardTitle className="text-xs font-heading font-bold uppercase tracking-widest text-slate-400">Días Atípicos e Insights</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {reportData.stats.outliers.length > 0 ? (
                        reportData.stats.outliers.map((outlier, idx) => (
                          <div key={idx} className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/5 group hover:bg-white/10 transition-colors">
                            <div className="p-2 bg-yellow-500/10 rounded-lg">
                              <AlertCircle className="h-5 w-5 text-yellow-500" />
                            </div>
                            <div>
                              <p className="text-xs font-heading font-bold uppercase tracking-widest text-slate-500">{outlier.date}</p>
                              <p className="text-sm font-heading font-bold text-slate-200 mt-1">{outlier.reason}</p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="flex flex-col items-center justify-center py-8 text-center">
                          <Activity className="h-8 w-8 text-slate-700 mb-2" />
                          <p className="text-sm text-slate-500 font-heading uppercase tracking-widest">No se detectaron días atípicos</p>
                        </div>
                      )}

                      {reportData.stats.avgIntake < 1200 && (
                        <div className="flex items-start gap-4 p-4 rounded-xl bg-primary/10 border border-primary/20">
                          <div className="p-2 bg-primary/20 rounded-lg">
                            <Info className="h-5 w-5 text-primary" />
                          </div>
                          <p className="text-sm font-heading font-bold text-primary leading-relaxed mt-1">
                            Llevás varios días comiendo muy poco. A veces un pequeño ajuste ayuda a sostener el progreso de forma saludable.
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="flex justify-center sm:justify-end pt-8">
                <Button 
                  onClick={generatePDF} 
                  disabled={isGenerating}
                  size="lg"
                  className="w-full sm:w-auto btn-hover rounded-2xl px-10 h-14 bg-secondary text-white font-heading font-bold uppercase tracking-widest shadow-xl shadow-secondary/20 border-none"
                >
                  {isGenerating ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <FileText className="mr-2 h-5 w-5" />}
                  Descargar Reporte PDF
                </Button>
              </div>

            </div>
          )}

          {!reportData && !isFetching && (
            <Card className="mt-8 border-dashed border-white/10 bg-transparent">
              <CardContent className="py-20 flex flex-col items-center justify-center text-center">
                <div className="p-6 bg-white/5 rounded-full mb-6">
                  <FileText className="h-12 w-12 text-slate-700 opacity-50" />
                </div>
                <h3 className="text-xl font-heading font-bold text-slate-400 uppercase tracking-widest">Esperando análisis</h3>
                <p className="text-sm text-slate-600 max-w-xs mt-2 font-heading tracking-tight">
                  Selecciona un período y haz clic en &quot;Analizar&quot; para obtener tus insights personalizados.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}

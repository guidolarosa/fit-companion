import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"

export interface ReportData {
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

interface PDFTranslations {
  pdfTitle: string
  pdfFullHistory: string
  pdfPeriodLabel: string
  pdfGeneratedLabel: string
  pdfExecutiveSummary: string
  pdfKeyMetrics: string
  pdfAvgDailyDeficit: string
  pdfAvgDailyIntake: string
  pdfProjectedWeeklyChange: string
  pdfCurrentStreak: string
  pdfBestStreak: string
  pdfDailyMacros: string
  pdfProtein: string
  pdfCarbs: string
  pdfFat: string
  pdfFiber: string
  pdfSugar: string
  pdfDailyDataTitle: string
  colDate: string
  colBurnt: string
  pdfSuccess: string
  pdfError: string
  days: string
  deficit: string
  maintenance: string
  surplus: string
  kcal: string
  kg: string
}

interface GenerateReportPDFParams {
  reportData: ReportData
  rangeType: "all" | "period"
  startDate: string
  endDate: string
  translations: PDFTranslations
}

export function generateReportPDF({
  reportData,
  rangeType,
  startDate,
  endDate,
  translations: t,
}: GenerateReportPDFParams) {
  const doc = new jsPDF()
  const title = t.pdfTitle
  const period =
    rangeType === "all"
      ? t.pdfFullHistory
      : `${new Date(startDate).toLocaleDateString("es-ES")} a ${new Date(endDate).toLocaleDateString("es-ES")}`

  doc.setFontSize(22)
  doc.setTextColor(249, 115, 22)
  doc.text(title, 14, 22)

  doc.setFontSize(11)
  doc.setTextColor(100)
  doc.text(`${t.pdfPeriodLabel} ${period}`, 14, 30)
  doc.text(`${t.pdfGeneratedLabel} ${new Date().toLocaleString("es-ES")}`, 14, 36)

  doc.setFontSize(14)
  doc.setTextColor(0)
  doc.text(t.pdfExecutiveSummary, 14, 50)
  doc.setFontSize(11)
  doc.setTextColor(60)
  const splitNarrative = doc.splitTextToSize(reportData.stats.narrative, 180)
  doc.text(splitNarrative, 14, 58)

  const narrativeHeight = splitNarrative.length * 6
  let currentY = 58 + narrativeHeight + 10

  doc.setFontSize(14)
  doc.setTextColor(0)
  doc.text(t.pdfKeyMetrics, 14, currentY)
  currentY += 8
  doc.setFontSize(11)
  doc.setTextColor(60)
  doc.text(`${t.pdfAvgDailyDeficit} ${Math.round(reportData.stats.avgDeficit)} kcal`, 14, currentY)
  doc.text(`${t.pdfAvgDailyIntake} ${Math.round(reportData.stats.avgIntake)} kcal`, 14, currentY + 6)
  doc.text(
    `${t.pdfProjectedWeeklyChange} ${reportData.stats.projectedWeightChange.toFixed(2)} kg`,
    14,
    currentY + 12
  )
  doc.text(`${t.pdfCurrentStreak} ${reportData.stats.streaks.current} ${t.days}`, 100, currentY)
  doc.text(`${t.pdfBestStreak} ${reportData.stats.streaks.best} ${t.days}`, 100, currentY + 6)

  currentY += 20

  // Macro averages
  const daysWithData = reportData.dailyData.length || 1
  const avgProtein =
    reportData.dailyData.reduce((s: number, d: any) => s + (d.protein || 0), 0) / daysWithData
  const avgCarbs =
    reportData.dailyData.reduce((s: number, d: any) => s + (d.carbs || 0), 0) / daysWithData
  const avgFat =
    reportData.dailyData.reduce((s: number, d: any) => s + (d.fat || 0), 0) / daysWithData
  const avgFiber =
    reportData.dailyData.reduce((s: number, d: any) => s + (d.fiber || 0), 0) / daysWithData
  const avgSugar =
    reportData.dailyData.reduce((s: number, d: any) => s + (d.sugar || 0), 0) / daysWithData

  doc.setFontSize(14)
  doc.setTextColor(0)
  doc.text(t.pdfDailyMacros, 14, currentY)
  currentY += 8
  doc.setFontSize(11)
  doc.setTextColor(60)
  doc.text(`${t.pdfProtein} ${Math.round(avgProtein)}g`, 14, currentY)
  doc.text(`${t.pdfCarbs} ${Math.round(avgCarbs)}g`, 70, currentY)
  doc.text(`${t.pdfFat} ${Math.round(avgFat)}g`, 140, currentY)
  currentY += 6
  doc.text(`${t.pdfFiber} ${Math.round(avgFiber)}g`, 14, currentY)
  doc.text(`${t.pdfSugar} ${Math.round(avgSugar)}g`, 70, currentY)

  currentY += 13

  const totalDays =
    reportData.stats.classification.deficit +
    reportData.stats.classification.maintenance +
    reportData.stats.classification.surplus
  const classRows = [
    [
      t.deficit,
      reportData.stats.classification.deficit,
      `${((reportData.stats.classification.deficit / (totalDays || 1)) * 100).toFixed(0)}%`,
    ],
    [
      t.maintenance,
      reportData.stats.classification.maintenance,
      `${((reportData.stats.classification.maintenance / (totalDays || 1)) * 100).toFixed(0)}%`,
    ],
    [
      t.surplus,
      reportData.stats.classification.surplus,
      `${((reportData.stats.classification.surplus / (totalDays || 1)) * 100).toFixed(0)}%`,
    ],
  ]

  autoTable(doc, {
    startY: currentY,
    head: [["Estado", t.days, "%"]],
    body: classRows,
    theme: "grid",
    headStyles: { fillColor: [249, 115, 22] },
    margin: { left: 14 },
    tableWidth: 80,
  })

  doc.addPage()
  doc.setFontSize(14)
  doc.setTextColor(0)
  doc.text(t.pdfDailyDataTitle, 14, 20)

  const tableRows = reportData.dailyData.map((day) => {
    const dateStr = new Date(day.date).toLocaleDateString("es-ES", {
      month: "short",
      day: "numeric",
      year: "numeric",
      timeZone: "UTC",
    })

    const dayExercises = reportData.exercises
      .filter(
        (e) => new Date(e.date).toISOString().split("T")[0] === day.date.split("T")[0]
      )
      .map((e) => e.name)
      .join(", ")

    const dayFoods = reportData.foods
      .filter(
        (f) => new Date(f.date).toISOString().split("T")[0] === day.date.split("T")[0]
      )
      .map((f) => f.name)
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
      dayExercises || "-",
    ]
  })

  autoTable(doc, {
    startY: 30,
    head: [
      [
        t.colDate,
        "Peso",
        "Kcal",
        t.colBurnt,
        "Prot(g)",
        "Carbs(g)",
        "Fat(g)",
        "Fibra(g)",
        "Azúcar(g)",
        "Alimentos",
        "Ejercicios",
      ],
    ],
    body: tableRows,
    theme: "striped",
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
      10: { cellWidth: 30 },
    },
    margin: { left: 8, right: 8 },
  })

  doc.save(`reporte-fit-companion-${new Date().toISOString().split("T")[0]}.pdf`)
}

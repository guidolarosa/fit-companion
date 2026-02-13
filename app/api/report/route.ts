import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireApiUser } from "@/lib/get-api-user";
import { aggregateDailyData } from "@/lib/daily-data";
import { calculateEnhancedStats } from "@/lib/stats";
import { cookies } from "next/headers";

// Load translation messages for stats narrative
async function getStatsTranslator(): Promise<(key: string, params?: Record<string, string | number>) => string> {
  const cookieStore = await cookies();
  const locale = cookieStore.get("locale")?.value || "es";
  const messages = (await import(`@/messages/${locale}.json`)).default;
  const statsMessages = messages.stats || {};
  
  return (key: string, params?: Record<string, string | number>) => {
    let result = statsMessages[key] || key;
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        result = result.replace(`{${k}}`, String(v));
      });
    }
    return result;
  };
}

export async function GET(request: NextRequest) {
  try {
    const userResult = await requireApiUser();
    if (userResult instanceof NextResponse) return userResult;
    const userId = userResult.id;

    const { searchParams } = new URL(request.url);
    const startDateStr = searchParams.get("startDate");
    const endDateStr = searchParams.get("endDate");

    let dateFilter: any = {};
    if (startDateStr && endDateStr) {
      dateFilter = {
        gte: new Date(startDateStr),
        lte: new Date(endDateStr),
      };
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    const exercises = await prisma.exercise.findMany({
      where: { 
        userId,
        ...(startDateStr && endDateStr ? { date: dateFilter } : {}),
      },
      orderBy: { date: "asc" },
    });

    const foods = await prisma.foodEntry.findMany({
      where: { 
        userId,
        ...(startDateStr && endDateStr ? { date: dateFilter } : {}),
      },
      orderBy: { date: "asc" },
    });

    const weights = await prisma.weightEntry.findMany({
      where: { 
        userId,
        ...(startDateStr && endDateStr ? { date: dateFilter } : {}),
      },
      orderBy: { date: "asc" },
    });

    // We also need ALL weights to correctly calculate BMR/TDEE for the period
    const allWeights = await prisma.weightEntry.findMany({
      where: { userId },
      orderBy: { date: "asc" },
    });

    const dailyData = aggregateDailyData(user, exercises, foods, allWeights);

    // Filter dailyData by the requested range if provided
    let filteredDailyData = dailyData;
    if (startDateStr && endDateStr) {
      const start = new Date(startDateStr);
      const end = new Date(endDateStr);
      filteredDailyData = dailyData.filter(d => d.date >= start && d.date <= end);
    }

    // Sort by date ASC for the report
    filteredDailyData.sort((a, b) => a.date.getTime() - b.date.getTime());

    // Get locale-aware translator for stats narrative
    const translator = await getStatsTranslator();
    const stats = calculateEnhancedStats(filteredDailyData, foods, exercises, translator);

    return NextResponse.json({
      dailyData: filteredDailyData,
      exercises,
      foods,
      weights,
      stats,
    });
  } catch (error) {
    console.error("Error generating report data:", error);
    return NextResponse.json(
      { error: "Failed to fetch report data" },
      { status: 500 }
    );
  }
}

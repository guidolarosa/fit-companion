import { getTranslations } from "next-intl/server";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { WeightGaugeCard } from "@/components/weight-gauge-card";
import { IFCard } from "@/components/if-card";
import { BMICard } from "@/components/bmi-card";
import { DailyTargetRingCard } from "@/components/daily-target-ring-card";
import {
  TrendingDown,
  TrendingUp,
  Info,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { DashboardData } from "@/lib/dashboard-data";

interface MetricsGridProps {
  data: DashboardData;
}

export async function MetricsGrid({ data }: MetricsGridProps) {
  const t = await getTranslations("dashboard");

  return (
    <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
      <div className="">
        <WeightGaugeCard
          currentWeight={data.latestWeight?.weight || null}
          targetWeightMin={data.targetWeightMin}
          targetWeightMax={data.targetWeightMax}
          milestoneStep={data.milestoneStep}
          weightDate={data.latestWeight?.date || null}
        />
      </div>

      <div className="">
        <IFCard
          ifType={data.user?.ifType || null}
          ifStartTime={data.user?.ifStartTime || null}
        />
      </div>

      <div className="">
        <BMICard
          bmi={data.bmi}
          currentWeight={data.latestWeight?.weight || null}
          height={data.user?.height || null}
        />
      </div>
      <div className="">
        <Card className="glass-card h-full">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-[10px] font-medium text-zinc-500 uppercase tracking-widest">
              {t("netCalories")}
            </CardTitle>
            {data.netCalories < 0 ? (
              <TrendingDown className="h-3.5 w-3.5 text-green-500" />
            ) : data.netCalories > 0 ? (
              <TrendingUp className="h-3.5 w-3.5 text-primary" />
            ) : (
              <TrendingUp className="h-3.5 w-3.5 text-zinc-500" />
            )}
          </CardHeader>
          <CardContent className="pt-2">
            <div className="flex items-baseline gap-2">
              <div
                className={cn(
                  "text-xl font-bold tracking-tight px-2 rounded-[4px] py-0.5",
                  data.netCalories < 0
                    ? "text-green-500 bg-green-500/10 border border-green-500/20"
                    : data.netCalories > 0
                    ? "text-primary bg-primary/10 border border-primary/20"
                    : "text-zinc-500 bg-zinc-500/10 border border-zinc-500/20"
                )}
              >
                {data.netCalories > 0 ? "+" : ""}
                {Math.round(data.netCalories)} 
                <span className="text-[10px] uppercase font-bold ml-1 opacity-50 tracking-widest">kcal</span>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2 text-[11px] uppercase tracking-tight text-zinc-500 font-bold">
              <div className="flex flex-col">
                <span>{t("daysLabel")}</span>
                <span className="text-zinc-300">{data.dailyData.length}</span>
              </div>
              <div className="flex flex-col">
                <span>{t("consumedLabel")}</span>
                <span className="text-zinc-300">{Math.round(data.totalCaloriesConsumed)}</span>
              </div>
              <div className="flex flex-col">
                <span>{t("spentLabel")}</span>
                <span className="text-zinc-300">{Math.round(data.totalCaloriesBurnt)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="">
        <DailyTargetRingCard
          date={data.dailyData[0]?.date ?? null}
          caloriesConsumed={data.dailyData[0]?.caloriesConsumed ?? null}
          dailyTarget={data.dailyData[0]?.tdee ?? null}
          netCalories={data.dailyData[0]?.netCalories ?? null}
          protein={data.dailyData[0]?.protein ?? 0}
          carbs={data.dailyData[0]?.carbs ?? 0}
          fiber={data.dailyData[0]?.fiber ?? 0}
          currentWeight={data.latestWeight?.weight ?? null}
        />
      </div>

      <div className="">
        <Card className="glass-card h-full">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-[10px] font-medium text-zinc-500 uppercase tracking-widest">{t("trend")}</CardTitle>
            <TrendingDown className="h-3.5 w-3.5 text-zinc-600" />
          </CardHeader>
          <CardContent className="pt-2 space-y-3">
            <div className="flex justify-between items-center text-[11px]">
              <span className="text-zinc-500 font-bold uppercase tracking-tight">{t("deficit7d")}</span>
              <span className="text-zinc-300 font-bold">
                {data.trendInsights.avgDeficit !== null
                  ? `${Math.round(data.trendInsights.avgDeficit)} kcal`
                  : "—"}
              </span>
            </div>
            <div className="flex justify-between items-center text-[11px]">
              <span className="text-zinc-500 font-bold uppercase tracking-tight">{t("pace")}</span>
              <span className={cn(
                "font-bold",
                data.trendInsights.projectedKgPerWeek === null ? "text-zinc-300" :
                data.trendInsights.projectedKgPerWeek < 0 ? "text-green-500" : "text-primary"
              )}>
                {data.trendInsights.projectedKgPerWeek === null
                  ? "—"
                  : `${Math.abs(data.trendInsights.projectedKgPerWeek).toFixed(2)} ${t("paceUnit")}`}
              </span>
            </div>
            {data.warnings.length > 0 && (
              <div className="mt-1 flex gap-1.5 items-start text-[10px] text-primary/80 font-bold uppercase tracking-tight leading-tight">
                <Info className="h-3 w-3 shrink-0 mt-0.5" />
                <p className="line-clamp-2">{t(data.warnings[0] as any)}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

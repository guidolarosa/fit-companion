import { getTranslations } from "next-intl/server";
import { Weight } from "lucide-react";
import { WeightChart } from "@/components/weight-chart";
import type { WeightData } from "@/lib/dashboard-data";

interface WeightChartSectionProps {
  weights: WeightData;
}

export async function WeightChartSection({ weights }: WeightChartSectionProps) {
  const t = await getTranslations("dashboard");

  return (
    <div className="mt-6 grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {/* Weight Progress - Hidden on mobile, full width */}
      <WeightChart
        weights={weights}
        chartHeight={200}
        title={t("weightProgress")}
        icon={<Weight className="h-3.5 w-3.5 text-zinc-600" />}
        cardClassName="hidden sm:block sm:col-span-2 lg:col-span-3 glass-card"
      />
    </div>
  );
}

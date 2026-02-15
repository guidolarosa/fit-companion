import { getTranslations } from "next-intl/server";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Activity, UtensilsCrossed } from "lucide-react";
import { ExerciseEntryList } from "@/components/exercise-entry-list";
import { FoodEntryList } from "@/components/food-entry-list";
import type { DashboardData } from "@/lib/dashboard-data";

interface RecentEntriesProps {
  recentExercises: DashboardData["recentExercises"];
  recentFoods: DashboardData["recentFoods"];
}

export async function RecentEntries({ recentExercises, recentFoods }: RecentEntriesProps) {
  const t = await getTranslations("dashboard");

  return (
    <div className="mt-6 sm:mt-8 grid gap-4 sm:gap-6 md:grid-cols-2">
      <Card className="overflow-hidden glass-card">
        <CardHeader className="pb-2 sm:pb-4">
          <CardTitle className="flex items-center gap-2 text-sm sm:text-base font-semibold">
            <Activity className="h-4 w-4 text-deficit" />
            {t("recentExercises")}
          </CardTitle>
          <CardDescription className="hidden sm:block text-xs text-zinc-500">
            {t("recentExercisesDesc")}
          </CardDescription>
        </CardHeader>
        <CardContent className="overflow-hidden">
          {recentExercises.length === 0 ? (
            /* Empty state per guidelines - with clear CTA */
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="w-12 h-12 mb-3 rounded-full bg-white/5 flex items-center justify-center">
                <Activity className="w-6 h-6 text-zinc-600" />
              </div>
              <h3 className="text-sm font-medium text-zinc-300 mb-1">
                {t("noExercises")}
              </h3>
              <p className="text-xs text-zinc-500 mb-4 max-w-[200px]">
                {t("noExercisesDesc")}
              </p>
              <a href="/exercise">
                <button className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary/80 transition-colors">
                  <Activity className="w-3 h-3" />
                  {t("addExercise")}
                </button>
              </a>
            </div>
          ) : (
            <ExerciseEntryList entries={recentExercises.slice(0, 3)} />
          )}
        </CardContent>
      </Card>

      <Card className="overflow-hidden glass-card">
        <CardHeader className="pb-2 sm:pb-4">
          <CardTitle className="flex items-center gap-2 text-sm sm:text-base font-semibold">
            <UtensilsCrossed className="h-4 w-4 text-surplus" />
            {t("recentFoods")}
          </CardTitle>
          <CardDescription className="hidden sm:block text-xs text-zinc-500">
            {t("recentFoodsDesc")}
          </CardDescription>
        </CardHeader>
        <CardContent className="overflow-hidden">
          {recentFoods.length === 0 ? (
            /* Empty state per guidelines - with clear CTA */
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="w-12 h-12 mb-3 rounded-full bg-white/5 flex items-center justify-center">
                <UtensilsCrossed className="w-6 h-6 text-zinc-600" />
              </div>
              <h3 className="text-sm font-medium text-zinc-300 mb-1">
                {t("noFoods")}
              </h3>
              <p className="text-xs text-zinc-500 mb-4 max-w-[200px]">
                {t("noFoodsDesc")}
              </p>
              <a href="/food">
                <button className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary/80 transition-colors">
                  <UtensilsCrossed className="w-3 h-3" />
                  {t("addFood")}
                </button>
              </a>
            </div>
          ) : (
            <FoodEntryList entries={recentFoods.slice(0, 3)} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}

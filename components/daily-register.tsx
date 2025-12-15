"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { format } from "date-fns";
import { Calendar } from "lucide-react";

interface DailyData {
  date: Date;
  caloriesConsumed: number;
  caloriesBurnt: number;
  bmr: number;
  tdee: number;
  netCalories: number;
}

interface DailyRegisterProps {
  dailyData: DailyData[];
}

export function DailyRegister({ dailyData }: DailyRegisterProps) {
  if (dailyData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Daily Register
          </CardTitle>
          <CardDescription>
            Daily calorie tracking with BMR and TDEE
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            No data available yet. Start tracking your food and exercise!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Daily Register
        </CardTitle>
        <CardDescription>
          Daily calorie tracking with BMR and TDEE
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[600px]">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2 sm:p-3 font-semibold">Date</th>
                <th className="text-right p-2 sm:p-3 font-semibold">BMR</th>
                <th className="text-right p-2 sm:p-3 font-semibold">TDEE</th>
                <th className="text-right p-2 sm:p-3 font-semibold">
                  Consumed
                </th>
                <th className="text-right p-2 sm:p-3 font-semibold">Burnt</th>
                <th className="text-right p-2 sm:p-3 font-semibold">Net</th>
              </tr>
            </thead>
            <tbody>
              {dailyData.map((day, index) => {
                const totalBurnt = day.tdee + day.caloriesBurnt;
                const netCalories = day.caloriesConsumed - totalBurnt;
                return (
                  <tr key={index} className="border-b hover:bg-muted/50">
                    <td className="p-2 sm:p-3 font-medium whitespace-nowrap">
                      {format(day.date, "MMM d, yyyy")}
                    </td>
                    <td className="p-2 sm:p-3 text-right text-muted-foreground whitespace-nowrap">
                      {day.bmr > 0 ? `${Math.round(day.bmr)}` : "-"}
                    </td>
                    <td className="p-2 sm:p-3 text-right text-muted-foreground whitespace-nowrap">
                      {day.tdee > 0 ? `${Math.round(day.tdee)}` : "-"}
                    </td>
                    <td className="p-2 sm:p-3 text-right whitespace-nowrap">
                      {Math.round(day.caloriesConsumed)}
                    </td>
                    <td className="p-2 sm:p-3 text-right whitespace-nowrap">
                      {Math.round(day.caloriesBurnt)}
                    </td>
                    <td
                      className={`p-2 sm:p-3 text-right font-semibold whitespace-nowrap ${
                        netCalories < 0
                          ? "text-green-400"
                          : netCalories > 0
                          ? "text-red-400"
                          : ""
                      }`}
                    >
                      {netCalories > 0 ? "+" : ""}
                      <span
                        className={`${
                          netCalories < 0
                            ? "text-green-400"
                            : netCalories > 0
                            ? "text-red-400"
                            : ""
                        } bg-${
                          netCalories < 0
                            ? "green"
                            : netCalories > 0
                            ? "red"
                            : "yellow"
                        }-400/10 rounded-md px-2 py-1`}
                      >
                        {Math.round(netCalories)}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="mt-4 text-xs text-muted-foreground space-y-1">
          <p>
            <strong>BMR:</strong> Basal Metabolic Rate (calories burned at rest)
          </p>
          <p>
            <strong>TDEE:</strong> Total Daily Energy Expenditure (BMR ×
            activity factor)
          </p>
          <p>
            <strong>Net:</strong> Consumed - (TDEE + Exercise calories)
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

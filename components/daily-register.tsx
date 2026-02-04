"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

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
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-xs font-medium text-zinc-500 uppercase tracking-widest flex items-center gap-2">
            <Calendar className="h-3.5 w-3.5" />
            Registro Diario
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-zinc-600 italic">No hay registros aún.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-card">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="text-xs font-medium text-zinc-500 uppercase tracking-widest flex items-center gap-2">
          <Calendar className="h-3.5 w-3.5" />
          Registro Diario
        </CardTitle>
        <Link href="/register/all">
          <Button variant="ghost" size="sm" className="h-7 text-[10px] uppercase tracking-widest text-zinc-500 hover:text-white">
            Ver todo <ChevronRight className="ml-1 h-3 w-3" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-xs min-w-[500px]">
            <thead>
              <tr className="text-[10px] text-zinc-600 uppercase tracking-widest border-b border-white/[0.03]">
                <th className="text-left font-medium pb-3 px-2">Fecha</th>
                <th className="text-right font-medium pb-3 px-2">BMR</th>
                <th className="text-right font-medium pb-3 px-2">TDEE</th>
                <th className="text-right font-medium pb-3 px-2">Consumo</th>
                <th className="text-right font-medium pb-3 px-2">Gasto</th>
                <th className="text-right font-medium pb-3 px-2">Neto</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.02]">
              {dailyData.map((day, index) => {
                const totalBurnt = day.tdee + day.caloriesBurnt;
                const netCalories = day.caloriesConsumed - totalBurnt;
                const isDeficit = netCalories < 0;
                
                const dateStr = day.date.toLocaleDateString('es-ES', { 
                  month: 'short', 
                  day: 'numeric', 
                  timeZone: 'UTC' 
                });

                return index < 7 && (
                  <tr key={index} className="group transition-colors">
                    <td className="py-3 px-2 text-zinc-400 font-medium">
                      {dateStr}
                    </td>
                    <td className="py-3 px-2 text-right text-zinc-600">
                      {day.bmr > 0 ? Math.round(day.bmr) : "-"}
                    </td>
                    <td className="py-3 px-2 text-right text-zinc-600">
                      {day.tdee > 0 ? Math.round(day.tdee) : "-"}
                    </td>
                    <td className="py-3 px-2 text-right text-zinc-300">
                      {Math.round(day.caloriesConsumed)}
                    </td>
                    <td className="py-3 px-2 text-right text-zinc-300">
                      {Math.round(day.caloriesBurnt)}
                    </td>
                    <td className="py-3 px-2 text-right">
                      <span className={cn(
                        "font-bold",
                        isDeficit ? "text-green-500" : netCalories > 0 ? "text-primary" : "text-zinc-500"
                      )}>
                        {netCalories > 0 ? "+" : ""}{Math.round(netCalories)}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

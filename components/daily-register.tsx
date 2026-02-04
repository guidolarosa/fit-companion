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
          <CardTitle className="flex items-center gap-2 font-heading uppercase tracking-wider text-slate-400">
            <Calendar className="h-5 w-5 text-primary" />
            Registro Diario
          </CardTitle>
          <CardDescription className="text-slate-500">
            Seguimiento de calorías, BMR y TDEE
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-500 italic">
            No hay datos disponibles. ¡Empieza a registrar tu comida y ejercicio!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-card border-none overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2 font-heading uppercase tracking-wider text-slate-400">
            <Calendar className="h-5 w-5 text-primary" />
            Registro Diario
          </CardTitle>
          <CardDescription className="text-slate-500">
            Últimos 7 días de actividad
          </CardDescription>
        </div>
        <Link href="/register/all">
          <Button variant="outline" size="sm" className="btn-hover rounded-xl border-white/10 text-slate-300">
            Ver Todo <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto -mx-6 px-6">
          <table className="w-full text-sm min-w-[600px]">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left py-4 px-2 font-heading font-bold uppercase tracking-widest text-[10px] text-slate-500">Fecha</th>
                <th className="text-right py-4 px-2 font-heading font-bold uppercase tracking-widest text-[10px] text-slate-500">BMR</th>
                <th className="text-right py-4 px-2 font-heading font-bold uppercase tracking-widest text-[10px] text-slate-500">TDEE</th>
                <th className="text-right py-4 px-2 font-heading font-bold uppercase tracking-widest text-[10px] text-slate-500">Consumo</th>
                <th className="text-right py-4 px-2 font-heading font-bold uppercase tracking-widest text-[10px] text-slate-500">Gasto</th>
                <th className="text-right py-4 px-2 font-heading font-bold uppercase tracking-widest text-[10px] text-slate-500">Neto</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {dailyData.map((day, index) => {
                const totalBurnt = day.tdee + day.caloriesBurnt;
                const netCalories = day.caloriesConsumed - totalBurnt;
                const isDeficit = netCalories < 0;
                
                const dateStr = day.date.toLocaleDateString('es-ES', { 
                  month: 'short', 
                  day: 'numeric', 
                  year: 'numeric', 
                  timeZone: 'UTC' 
                });

                return index < 7 && (
                  <tr key={index} className="group hover:bg-white/[0.02] transition-colors">
                    <td className="py-4 px-2 font-bold text-slate-200 whitespace-nowrap">
                      {dateStr}
                    </td>
                    <td className="py-4 px-2 text-right text-slate-500 whitespace-nowrap font-heading">
                      {day.bmr > 0 ? `${Math.round(day.bmr)}` : "-"}
                    </td>
                    <td className="py-4 px-2 text-right text-slate-500 whitespace-nowrap font-heading">
                      {day.tdee > 0 ? `${Math.round(day.tdee)}` : "-"}
                    </td>
                    <td className="py-4 px-2 text-right text-slate-200 whitespace-nowrap font-heading">
                      {Math.round(day.caloriesConsumed)}
                    </td>
                    <td className="py-4 px-2 text-right text-slate-200 whitespace-nowrap font-heading">
                      {Math.round(day.caloriesBurnt)}
                    </td>
                    <td className="py-4 px-2 text-right whitespace-nowrap">
                      <div className={cn(
                        "inline-flex items-center px-2 py-1 rounded-lg font-heading font-bold text-xs",
                        isDeficit ? "bg-secondary/10 text-secondary" : netCalories > 0 ? "bg-primary/10 text-primary" : "bg-white/5 text-slate-400"
                      )}>
                        {netCalories > 0 ? "+" : ""}{Math.round(netCalories)}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="mt-6 flex flex-wrap gap-4 text-[10px] text-slate-500 font-heading uppercase tracking-widest border-t border-white/5 pt-4">
          <p><strong className="text-slate-400">BMR:</strong> Metabolismo Basal</p>
          <p><strong className="text-slate-400">TDEE:</strong> Gasto Energético Total (BMR × actividad)</p>
          <p><strong className="text-slate-400">NETO:</strong> Consumo - (TDEE + Ejercicio)</p>
        </div>
      </CardContent>
    </Card>
  );
}

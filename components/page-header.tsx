"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FittyButton } from "@/components/fitty-button";

interface PageHeaderProps {
  title: string;
  description?: string;
  showBackButton?: boolean;
  showFittyButton?: boolean;
}

export function PageHeader({
  title,
  description,
  showBackButton = false,
  showFittyButton = true,
}: PageHeaderProps) {
  const router = useRouter();

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 sm:mb-12">
      <div className="flex items-center gap-4">
        {showBackButton && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="h-10 w-10 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 transition-all"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
        )}
        <div className="flex flex-col">
          <h1 className="text-3xl sm:text-4xl font-heading font-bold text-slate-50 uppercase tracking-tight italic">
            {title}
          </h1>
          {description && (
            <p className="text-sm font-heading font-bold uppercase tracking-widest text-slate-500 mt-1">
              {description}
            </p>
          )}
        </div>
      </div>
      
      {showFittyButton && (
        <div className="flex shrink-0">
          <FittyButton />
        </div>
      )}
    </div>
  );
}

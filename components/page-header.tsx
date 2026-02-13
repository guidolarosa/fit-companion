"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
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
  const t = useTranslations("nav");

  return (
    <header 
      id="main-content"
      className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-2 sm:mb-10"
      role="banner"
    >
      <div className="flex items-center gap-4">
        {showBackButton && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="h-9 w-9 rounded-lg border border-white/[0.05] hover:bg-white/[0.05] touch-target"
            aria-label={t("back")}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        )}
        <div className="flex flex-col">
          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-white tracking-tight">
            {title}
          </h1>
          {description && (
            <p className="text-xs sm:text-sm font-medium text-zinc-500 mt-1">
              {description}
            </p>
          )}
        </div>
      </div>
      
      {showFittyButton && (
        <div className="flex">
          <FittyButton />
        </div>
      )}
    </header>
  );
}

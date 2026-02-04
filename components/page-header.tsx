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
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
      <div className="flex items-center gap-4">
        {showBackButton && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="h-8 w-8 rounded-md border border-white/[0.05] hover:bg-white/[0.05]"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        )}
        <div className="flex flex-col">
          <h1 className="text-3xl font-heading font-bold text-white tracking-tight">
            {title}
          </h1>
          {description && (
            <p className="text-sm font-medium text-zinc-500 mt-1">
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
    </div>
  );
}

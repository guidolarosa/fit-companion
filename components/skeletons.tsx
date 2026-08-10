import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function EntryListSkeleton({ rows = 5, withPagination = false }: { rows?: number; withPagination?: boolean }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-white/5">
          <div className="flex items-center gap-3 min-w-0">
            <Skeleton className="h-9 w-9 rounded-full shrink-0" />
            <div className="space-y-1.5 min-w-0">
              <Skeleton className="h-3 w-32" />
              <Skeleton className="h-2.5 w-20" />
            </div>
          </div>
          <Skeleton className="h-5 w-14 shrink-0" />
        </div>
      ))}
      {withPagination && (
        <div className="flex justify-center pt-4">
          <Skeleton className="h-8 w-48" />
        </div>
      )}
    </div>
  )
}

export function TableCardSkeleton({ rows = 8 }: { rows?: number }) {
  return (
    <>
      <CardHeader>
        <Skeleton className="h-5 w-40 mb-2" />
        <Skeleton className="h-3.5 w-64" />
      </CardHeader>
      <CardContent>
        <EntryListSkeleton rows={rows} withPagination />
      </CardContent>
    </>
  )
}

export function WeightSectionSkeleton() {
  return (
    <div className="grid gap-6 lg:grid-cols-1">
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="glass-card">
          <CardHeader>
            <Skeleton className="h-3 w-28 mb-2" />
            <Skeleton className="h-2.5 w-40" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[200px] w-full" />
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardHeader>
            <Skeleton className="h-3 w-28 mb-2" />
            <Skeleton className="h-2.5 w-40" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[200px] w-full" />
          </CardContent>
        </Card>
      </div>
      <Card className="glass-card">
        <CardHeader>
          <Skeleton className="h-3 w-28 mb-2" />
          <Skeleton className="h-2.5 w-40" />
        </CardHeader>
        <CardContent>
          <EntryListSkeleton rows={4} />
        </CardContent>
      </Card>
    </div>
  )
}

export function SettingsFormSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-9 w-full" />
        </div>
      ))}
      <Skeleton className="h-9 w-32 mt-2" />
    </div>
  )
}

export function WeightChartSkeleton() {
  return (
    <Card className="hidden sm:block sm:col-span-2 lg:col-span-3 glass-card">
      <CardHeader>
        <Skeleton className="h-3 w-32 mb-2" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-[200px] w-full" />
      </CardContent>
    </Card>
  )
}

export function DashboardWidgetsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 9 }).map((_, i) => (
          <Skeleton key={i} className="h-[160px] w-full" />
        ))}
      </div>
      <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2">
        <Skeleton className="h-[220px] w-full" />
        <Skeleton className="h-[220px] w-full" />
      </div>
    </div>
  )
}

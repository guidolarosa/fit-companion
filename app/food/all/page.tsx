import { Sidebar } from "@/components/sidebar"
import { MobileSidebar } from "@/components/mobile-sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/lib/get-session"
import { redirect } from "next/navigation"
import { UtensilsCrossed } from "lucide-react"
import { AllFoodEntriesTable } from "@/components/all-food-entries-table"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

interface PageProps {
  searchParams: { page?: string }
}

async function getAllFoodEntries(userId: string, page: number = 1) {
  const pageSize = 10
  const skip = (page - 1) * pageSize

  const [foods, totalCount] = await Promise.all([
    prisma.foodEntry.findMany({
      where: { userId },
      orderBy: { date: "desc" },
      skip,
      take: pageSize,
    }),
    prisma.foodEntry.count({
      where: { userId },
    }),
  ])

  const totalPages = Math.ceil(totalCount / pageSize)

  return { foods, totalCount, totalPages, currentPage: page }
}

export default async function AllFoodEntriesPage({ searchParams }: PageProps) {
  const user = await getCurrentUser()
  
  if (!user) {
    redirect("/login")
  }

  const page = Math.max(1, parseInt(searchParams.page || "1", 10))
  const { foods, totalCount, totalPages, currentPage } = await getAllFoodEntries(user.id, page)
  
  // Redirect if page is out of bounds (only if there are entries)
  if (totalCount > 0 && currentPage > totalPages) {
    redirect("/food/all?page=1")
  }

  return (
    <div className="flex h-screen">
      <Sidebar />
      <MobileSidebar />
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center justify-between mb-6 sm:mb-8">
            <div className="flex items-center gap-4">
              <Link href="/food">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <h1 className="text-2xl sm:text-3xl font-bold">All Food Entries</h1>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UtensilsCrossed className="h-5 w-5" />
                Food Entries ({totalCount})
              </CardTitle>
              <CardDescription>All your recorded food entries and calories consumed</CardDescription>
            </CardHeader>
            <CardContent>
              {foods.length === 0 ? (
                <p className="text-sm text-muted-foreground">No food entries yet</p>
              ) : (
                <AllFoodEntriesTable 
                  entries={foods} 
                  currentPage={currentPage}
                  totalPages={totalPages}
                />
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

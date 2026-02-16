import { getTranslations } from "next-intl/server"
import { Sidebar } from "@/components/sidebar"
import { MobileSidebar } from "@/components/mobile-sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/lib/get-session"
import { redirect } from "next/navigation"
import { Weight, ArrowLeft } from "lucide-react"
import { AllWeightEntriesTable } from "@/components/all-weight-entries-table"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface PageProps {
  searchParams: Promise<{ page?: string }>
}

async function getAllWeightEntries(userId: string, page: number = 1) {
  const pageSize = 10
  const skip = (page - 1) * pageSize

  const [weights, totalCount] = await Promise.all([
    prisma.weightEntry.findMany({
      where: { userId },
      orderBy: { date: "desc" },
      skip,
      take: pageSize,
    }),
    prisma.weightEntry.count({
      where: { userId },
    }),
  ])

  const totalPages = Math.ceil(totalCount / pageSize)

  return { weights, totalCount, totalPages, currentPage: page }
}

export default async function AllWeightEntriesPage({ searchParams }: PageProps) {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  const resolvedParams = await searchParams
  const page = Math.max(1, parseInt(resolvedParams.page || "1", 10))
  const { weights, totalCount, totalPages, currentPage } = await getAllWeightEntries(user.id, page)
  const t = await getTranslations("weight")

  // Redirect if page is out of bounds (only if there are entries)
  if (totalCount > 0 && currentPage > totalPages) {
    redirect("/weight/all?page=1")
  }

  return (
    <div className="flex h-screen">
      <Sidebar />
      <MobileSidebar />
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center justify-between mb-6 sm:mb-8">
            <div className="flex items-center gap-4">
              <Link href="/weight">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <h1 className="text-2xl sm:text-3xl font-bold">{t("allTitle")}</h1>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Weight className="h-5 w-5" />
                {t("allCardTitle")} ({totalCount})
              </CardTitle>
              <CardDescription>{t("allCardDescription")}</CardDescription>
            </CardHeader>
            <CardContent>
              {weights.length === 0 ? (
                <p className="text-sm text-muted-foreground">{t("allEmpty")}</p>
              ) : (
                <AllWeightEntriesTable entries={weights} currentPage={currentPage} totalPages={totalPages} />
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

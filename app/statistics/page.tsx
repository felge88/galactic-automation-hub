import { getCurrentUser } from "@/lib/auth"
import { redirect } from "next/navigation"
import { EnhancedStatisticsOverview } from "@/components/statistics/enhanced-statistics-overview"

export default async function StatisticsPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  return <EnhancedStatisticsOverview />
}

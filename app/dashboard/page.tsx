import { getCurrentUser } from "@/lib/auth"
import { redirect } from "next/navigation"
import { EnhancedWelcomeSection } from "@/components/dashboard/enhanced-welcome-section"
import { ActivityFeed } from "@/components/dashboard/activity-feed"
import { QuickStats } from "@/components/dashboard/quick-stats"
import { RecentActions } from "@/components/dashboard/recent-actions"

export default async function DashboardPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  return (
    <div className="space-y-6">
      <EnhancedWelcomeSection user={user} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <QuickStats />
          <RecentActions />
        </div>
        <div>
          <ActivityFeed />
        </div>
      </div>
    </div>
  )
}

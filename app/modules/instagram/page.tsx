import { getCurrentUser } from "@/lib/auth"
import { redirect } from "next/navigation"
import { EnhancedInstagramDashboard } from "@/components/modules/instagram/enhanced-instagram-dashboard"

export default async function InstagramPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  // Check if user has Instagram module permission
  if (!user.permissions.instagram) {
    redirect("/modules")
  }

  return <EnhancedInstagramDashboard />
}

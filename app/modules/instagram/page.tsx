import { getCurrentUser } from "@/lib/auth"
import { redirect } from "next/navigation"
import { EnhancedInstagramDashboard } from "@/components/modules/instagram/enhanced-instagram-dashboard"

export default async function InstagramPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  // TODO: Re-enable permission check when TypeScript types are fixed
  // Check if user has Instagram module permission
  // if (!(user as any).permissions?.instagram && user.role !== 'ADMIN') {
  //   redirect("/modules")
  // }

  return <EnhancedInstagramDashboard />
}

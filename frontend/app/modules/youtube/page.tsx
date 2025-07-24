import { getCurrentUser } from "@/lib/auth"
import { redirect } from "next/navigation"
import { EnhancedYoutubeDashboard } from "@/components/modules/youtube/enhanced-youtube-dashboard"

export default async function YouTubePage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  // TODO: Re-enable permission check when TypeScript types are fixed
  // Check if user has YouTube module permission
  // if (!(user as any).permissions?.youtube && user.role !== 'ADMIN') {
  //   redirect("/modules")
  // }

  return <EnhancedYoutubeDashboard />
}

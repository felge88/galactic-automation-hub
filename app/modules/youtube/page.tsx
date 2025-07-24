import { getCurrentUser } from "@/lib/auth"
import { redirect } from "next/navigation"
import { EnhancedYouTubeDownloader } from "@/components/modules/youtube/enhanced-youtube-downloader"

export default async function YouTubePage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  // Check if user has YouTube module permission
  if (!user.permissions?.youtube && user.role !== 'ADMIN') {
    redirect("/modules")
  }

  return <EnhancedYouTubeDownloader />
}

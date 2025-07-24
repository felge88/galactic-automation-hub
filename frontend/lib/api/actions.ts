// Placeholder API functions for recent actions

export interface RecentAction {
  id: string
  type: "instagram_post" | "youtube_download" | "account_added"
  title: string
  status: "success" | "pending" | "failed"
  timestamp: Date
  details?: string
}

export async function getRecentActions(): Promise<RecentAction[]> {
  // Placeholder - implement with real API call
  return [
    {
      id: "1",
      type: "instagram_post",
      title: "Post zu Gesundheitstipps",
      status: "success",
      timestamp: new Date(Date.now() - 1000 * 60 * 15),
      details: "Account: @health_guru_2024",
    },
    {
      id: "2",
      type: "youtube_download",
      title: 'Video Download: "Meditation Music"',
      status: "success",
      timestamp: new Date(Date.now() - 1000 * 60 * 45),
      details: "1080p MP4 Format",
    },
    {
      id: "3",
      type: "instagram_post",
      title: "Automatischer Post",
      status: "pending",
      timestamp: new Date(Date.now() - 1000 * 60 * 60),
      details: "Wartet auf Genehmigung",
    },
  ]
}

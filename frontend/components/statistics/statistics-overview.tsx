"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Users, Download, Calendar } from "lucide-react"

export function StatisticsOverview() {
  // Mock-Statistiken
  const stats = {
    totalFollowers: 45230,
    followerGrowth: 12.5,
    totalDownloads: 1247,
    downloadGrowth: 8.3,
    postsThisMonth: 67,
    engagementRate: 4.2,
  }

  const recentActivity = [
    {
      id: "1",
      type: "follower_gain",
      description: "+125 neue Follower auf @imperial_fitness",
      timestamp: "vor 2 Stunden",
      value: "+125",
    },
    {
      id: "2",
      type: "post_published",
      description: "Post veröffentlicht: 'Galaktische Workout Routine'",
      timestamp: "vor 4 Stunden",
      value: "1.2k Likes",
    },
    {
      id: "3",
      type: "download_completed",
      description: "YouTube Video heruntergeladen",
      timestamp: "vor 6 Stunden",
      value: "45.2 MB",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Haupt-Statistiken */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hologram-card">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-400">Gesamt Follower</CardTitle>
              <Users className="w-4 h-4 text-yellow-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-400">{stats.totalFollowers.toLocaleString()}</div>
            <div className="flex items-center mt-1">
              <TrendingUp className="w-3 h-3 text-green-400 mr-1" />
              <span className="text-xs text-green-400">+{stats.followerGrowth}% diese Woche</span>
            </div>
          </CardContent>
        </Card>

        <Card className="hologram-card">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-400">Downloads</CardTitle>
              <Download className="w-4 h-4 text-blue-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-400">{stats.totalDownloads}</div>
            <div className="flex items-center mt-1">
              <TrendingUp className="w-3 h-3 text-green-400 mr-1" />
              <span className="text-xs text-green-400">+{stats.downloadGrowth}% diese Woche</span>
            </div>
          </CardContent>
        </Card>

        <Card className="hologram-card">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-400">Posts diesen Monat</CardTitle>
              <Calendar className="w-4 h-4 text-purple-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-400">{stats.postsThisMonth}</div>
            <div className="text-xs text-gray-400 mt-1">Durchschnitt: 2.2/Tag</div>
          </CardContent>
        </Card>

        <Card className="hologram-card">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-400">Engagement Rate</CardTitle>
              <TrendingUp className="w-4 h-4 text-green-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">{stats.engagementRate}%</div>
            <div className="text-xs text-gray-400 mt-1">Über Branchendurchschnitt</div>
          </CardContent>
        </Card>
      </div>

      {/* Aktivitäts-Feed */}
      <Card className="hologram-card">
        <CardHeader>
          <CardTitle className="text-yellow-400">Letzte Aktivitäten</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center justify-between p-3 rounded-lg bg-gray-700/50 border border-gray-600"
              >
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">{activity.description}</p>
                  <p className="text-xs text-gray-400">{activity.timestamp}</p>
                </div>
                <Badge className="status-green">{activity.value}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

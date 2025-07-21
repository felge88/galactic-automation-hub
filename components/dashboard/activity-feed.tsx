"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getRecentActivities } from "@/lib/api/activities"
import { useEffect, useState } from "react"

interface Activity {
  id: string
  type: "login" | "logout" | "post" | "download"
  description: string
  timestamp: Date
  device?: string
  location?: string
  suspicious?: boolean
}

export function ActivityFeed() {
  const [activities, setActivities] = useState<Activity[]>([])

  useEffect(() => {
    // Placeholder function - will be implemented with real API
    const loadActivities = async () => {
      const data = await getRecentActivities()
      setActivities(data)
    }

    loadActivities()
  }, [])

  return (
    <Card className="hologram-card">
      <CardHeader>
        <CardTitle className="text-blue-400 neon-glow">Letzte Aktivitäten</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className={`p-3 rounded-lg border ${
                activity.suspicious ? "border-red-500 bg-red-500/10" : "border-gray-600 bg-gray-700/50"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">{activity.description}</span>
                {activity.suspicious && (
                  <Badge variant="destructive" className="text-xs">
                    Verdächtig
                  </Badge>
                )}
              </div>
              <div className="text-xs text-gray-400">{activity.timestamp.toLocaleString("de-DE")}</div>
              {activity.device && (
                <div className="text-xs text-gray-500 mt-1">
                  {activity.device} • {activity.location}
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { getRecentActions } from "@/lib/api/actions"

interface RecentAction {
  id: string
  type: "instagram_post" | "youtube_download" | "account_added"
  title: string
  status: "success" | "pending" | "failed"
  timestamp: Date
  details?: string
}

export function RecentActions() {
  const [actions, setActions] = useState<RecentAction[]>([])

  useEffect(() => {
    const loadActions = async () => {
      const data = await getRecentActions()
      setActions(data)
    }

    loadActions()
  }, [])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "success":
        return <Badge className="status-green">Erfolgreich</Badge>
      case "pending":
        return <Badge className="status-yellow">Wartend</Badge>
      case "failed":
        return <Badge className="status-red">Fehlgeschlagen</Badge>
      default:
        return <Badge>Unbekannt</Badge>
    }
  }

  return (
    <Card className="hologram-card">
      <CardHeader>
        <CardTitle className="text-blue-400 neon-glow">Letzte Aktionen</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {actions.map((action) => (
            <div
              key={action.id}
              className="flex items-center justify-between p-3 rounded-lg bg-gray-700/50 border border-gray-600"
            >
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="font-medium">{action.title}</span>
                  {getStatusBadge(action.status)}
                </div>
                <div className="text-sm text-gray-400">{action.timestamp.toLocaleString("de-DE")}</div>
                {action.details && <div className="text-xs text-gray-500 mt-1">{action.details}</div>}
              </div>
              <Button variant="ghost" size="sm">
                Details
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

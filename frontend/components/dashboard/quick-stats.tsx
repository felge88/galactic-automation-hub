"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useEffect, useState } from "react"
import { getQuickStats } from "@/lib/api/stats"

interface QuickStatsData {
  instagramAccounts: number
  totalPosts: number
  totalDownloads: number
  activeAutomations: number
}

export function QuickStats() {
  const [stats, setStats] = useState<QuickStatsData | null>(null)

  useEffect(() => {
    const loadStats = async () => {
      const data = await getQuickStats()
      setStats(data)
    }

    loadStats()
  }, [])

  if (!stats) {
    return <div>Lade Statistiken...</div>
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="hologram-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-400">Instagram Accounts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-400 neon-glow">{stats.instagramAccounts}</div>
        </CardContent>
      </Card>

      <Card className="hologram-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-400">Gesamt Posts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-400 neon-glow">{stats.totalPosts}</div>
        </CardContent>
      </Card>

      <Card className="hologram-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-400">Downloads</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-400 neon-glow">{stats.totalDownloads}</div>
        </CardContent>
      </Card>

      <Card className="hologram-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-400">Aktive Automationen</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <div className="text-2xl font-bold text-yellow-400 neon-glow">{stats.activeAutomations}</div>
            <Badge className="status-green">Aktiv</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

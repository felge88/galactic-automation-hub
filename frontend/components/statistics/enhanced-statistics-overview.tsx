"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TrendingUp, Calendar, BarChart3, PieChart, LineChart, FileText } from "lucide-react"

interface StatData {
  label: string
  value: number
  change: number
  trend: "up" | "down" | "stable"
}

interface ChartData {
  name: string
  value: number
  color: string
}

export function EnhancedStatisticsOverview() {
  const [timeframe, setTimeframe] = useState("7d")
  const [selectedMetric, setSelectedMetric] = useState("followers")

  const overviewStats: StatData[] = [
    {
      label: "Gesamt Follower",
      value: 45230,
      change: 12.5,
      trend: "up",
    },
    {
      label: "Downloads",
      value: 1247,
      change: 8.3,
      trend: "up",
    },
    {
      label: "Posts diesen Monat",
      value: 67,
      change: -2.1,
      trend: "down",
    },
    {
      label: "Engagement Rate",
      value: 4.2,
      change: 0.8,
      trend: "up",
    },
    {
      label: "Neue Follower (7d)",
      value: 892,
      change: 15.2,
      trend: "up",
    },
    {
      label: "Video Views",
      value: 23450,
      change: 22.1,
      trend: "up",
    },
  ]

  const platformStats: ChartData[] = [
    { name: "Instagram", value: 65, color: "#E1306C" },
    { name: "YouTube", value: 25, color: "#FF0000" },
    { name: "TikTok", value: 10, color: "#000000" },
  ]

  const engagementData = [
    { name: "Likes", value: 15420, color: "#ef4444" },
    { name: "Comments", value: 3240, color: "#3b82f6" },
    { name: "Shares", value: 1890, color: "#10b981" },
    { name: "Saves", value: 2340, color: "#f59e0b" },
  ]

  const recentActivity = [
    {
      id: "1",
      type: "follower_milestone",
      description: "🎉 45.000 Follower Meilenstein erreicht!",
      timestamp: "vor 2 Stunden",
      value: "+1.2k",
      trend: "up",
    },
    {
      id: "2",
      type: "viral_post",
      description: "🚀 Post ging viral: 'Galaktische Workout Routine'",
      timestamp: "vor 4 Stunden",
      value: "15.2k Views",
      trend: "up",
    },
    {
      id: "3",
      type: "engagement_spike",
      description: "📈 Engagement Rate stieg um 25%",
      timestamp: "vor 6 Stunden",
      value: "+0.8%",
      trend: "up",
    },
    {
      id: "4",
      type: "download_peak",
      description: "⬇️ Rekord-Downloads heute",
      timestamp: "vor 8 Stunden",
      value: "127 Downloads",
      trend: "up",
    },
  ]

  const topPosts = [
    {
      id: "1",
      title: "Jedi Training Workout 💪",
      platform: "Instagram",
      likes: 5420,
      comments: 234,
      shares: 89,
      engagement: 8.2,
      thumbnail: "/placeholder.svg?height=80&width=80",
    },
    {
      id: "2",
      title: "Death Star Smoothie Recipe 🥤",
      platform: "Instagram",
      likes: 3890,
      comments: 156,
      shares: 67,
      engagement: 6.8,
      thumbnail: "/placeholder.svg?height=80&width=80",
    },
    {
      id: "3",
      title: "Imperial March Workout Music",
      platform: "YouTube",
      likes: 2340,
      comments: 89,
      shares: 45,
      engagement: 5.4,
      thumbnail: "/placeholder.svg?height=80&width=80",
    },
  ]

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="w-3 h-3 text-green-400" />
      case "down":
        return <TrendingUp className="w-3 h-3 text-red-400 rotate-180" />
      default:
        return <div className="w-3 h-3 bg-gray-400 rounded-full" />
    }
  }

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case "up":
        return "text-green-400"
      case "down":
        return "text-red-400"
      default:
        return "text-gray-400"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-orbitron font-bold neon-text mb-4">
            <b>GALAKTISCHE</b> <i>STATISTIKEN</i>
          </h1>
          <p className="text-gray-400 text-lg">Detaillierte Analytics und Performance-Berichte</p>
        </div>
        <div className="flex items-center space-x-4">
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-32 bg-gray-800 border-gray-600">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-600">
              <SelectItem value="24h">24 Stunden</SelectItem>
              <SelectItem value="7d">7 Tage</SelectItem>
              <SelectItem value="30d">30 Tage</SelectItem>
              <SelectItem value="90d">90 Tage</SelectItem>
              <SelectItem value="1y">1 Jahr</SelectItem>
            </SelectContent>
          </Select>
          <Button className="lightsaber-btn">
            <FileText className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {overviewStats.map((stat, index) => (
          <Card key={index} className="hologram-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm text-gray-400">{stat.label}</div>
                {getTrendIcon(stat.trend)}
              </div>
              <div className="text-2xl font-bold text-white mb-1">
                {stat.value.toLocaleString()}
                {stat.label.includes("Rate") && "%"}
              </div>
              <div className={`text-xs flex items-center ${getTrendColor(stat.trend)}`}>
                <span>
                  {stat.change > 0 ? "+" : ""}
                  {stat.change}%
                </span>
                <span className="text-gray-500 ml-1">vs. vorherige Periode</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Analytics Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 bg-gray-800">
          <TabsTrigger value="overview">Übersicht</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
          <TabsTrigger value="growth">Wachstum</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="audience">Zielgruppe</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Platform Distribution */}
            <Card className="hologram-card">
              <CardHeader>
                <CardTitle className="text-yellow-400 flex items-center">
                  <PieChart className="w-5 h-5 mr-2" />
                  Plattform Verteilung
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {platformStats.map((platform) => (
                    <div key={platform.name} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: platform.color }} />
                        <span className="text-white">{platform.name}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 bg-gray-700 rounded-full h-2">
                          <div
                            className="h-2 rounded-full transition-all duration-500"
                            style={{
                              width: `${platform.value}%`,
                              backgroundColor: platform.color,
                            }}
                          />
                        </div>
                        <span className="text-sm text-gray-400 w-10 text-right">{platform.value}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Engagement Breakdown */}
            <Card className="hologram-card">
              <CardHeader>
                <CardTitle className="text-yellow-400 flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2" />
                  Engagement Aufschlüsselung
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {engagementData.map((item) => (
                    <div key={item.name} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-white">{item.name}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-400">{item.value.toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card className="hologram-card">
            <CardHeader>
              <CardTitle className="text-yellow-400 flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                Letzte Aktivitäten
              </CardTitle>
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
                    <div className="flex items-center space-x-2">
                      <Badge className={`${getTrendColor(activity.trend)} bg-transparent border`}>
                        {activity.value}
                      </Badge>
                      {getTrendIcon(activity.trend)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Engagement Tab */}
        <TabsContent value="engagement" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="hologram-card">
              <CardHeader>
                <CardTitle className="text-yellow-400">Engagement Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-gray-400">
                  <LineChart className="w-16 h-16 mb-4" />
                  <div className="text-center">
                    <p>Engagement Chart</p>
                    <p className="text-sm">Backend Integration erforderlich</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hologram-card">
              <CardHeader>
                <CardTitle className="text-yellow-400">Top Performing Posts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topPosts.map((post) => (
                    <div
                      key={post.id}
                      className="flex items-center space-x-4 p-3 rounded-lg bg-gray-700/50 border border-gray-600"
                    >
                      <img
                        src={post.thumbnail || "/placeholder.svg"}
                        alt={post.title}
                        className="w-12 h-12 rounded object-cover"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-white text-sm">{post.title}</h4>
                        <div className="flex items-center space-x-4 text-xs text-gray-400 mt-1">
                          <span>❤️ {post.likes.toLocaleString()}</span>
                          <span>💬 {post.comments}</span>
                          <span>🔄 {post.shares}</span>
                        </div>
                      </div>
                      <Badge className="status-green">{post.engagement}%</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Growth Tab */}
        <TabsContent value="growth" className="space-y-6">
          <Card className="hologram-card">
            <CardHeader>
              <CardTitle className="text-yellow-400 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2" />
                Follower Wachstum
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center text-gray-400">
                <div className="text-center">
                  <LineChart className="w-16 h-16 mb-4 mx-auto" />
                  <p>Wachstums-Chart</p>
                  <p className="text-sm">Backend Integration erforderlich</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Content Tab */}
        <TabsContent value="content" className="space-y-6">
          <Card className="hologram-card">
            <CardHeader>
              <CardTitle className="text-yellow-400">Content Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-gray-700/50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-400">67</div>
                  <div className="text-sm text-gray-400">Posts diesen Monat</div>
                </div>
                <div className="text-center p-4 bg-gray-700/50 rounded-lg">
                  <div className="text-2xl font-bold text-green-400">4.2%</div>
                  <div className="text-sm text-gray-400">Ø Engagement Rate</div>
                </div>
                <div className="text-center p-4 bg-gray-700/50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-400">23.4k</div>
                  <div className="text-sm text-gray-400">Ø Views pro Post</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Audience Tab */}
        <TabsContent value="audience" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="hologram-card">
              <CardHeader>
                <CardTitle className="text-yellow-400">Demografische Daten</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>18-24 Jahre</span>
                      <span>35%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div className="bg-blue-400 h-2 rounded-full" style={{ width: "35%" }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>25-34 Jahre</span>
                      <span>42%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div className="bg-green-400 h-2 rounded-full" style={{ width: "42%" }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>35-44 Jahre</span>
                      <span>18%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div className="bg-yellow-400 h-2 rounded-full" style={{ width: "18%" }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>45+ Jahre</span>
                      <span>5%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div className="bg-purple-400 h-2 rounded-full" style={{ width: "5%" }} />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hologram-card">
              <CardHeader>
                <CardTitle className="text-yellow-400">Top Länder</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { country: "Deutschland", percentage: 45, flag: "🇩🇪" },
                    { country: "Österreich", percentage: 18, flag: "🇦🇹" },
                    { country: "Schweiz", percentage: 12, flag: "🇨🇭" },
                    { country: "USA", percentage: 15, flag: "🇺🇸" },
                    { country: "Andere", percentage: 10, flag: "🌍" },
                  ].map((item) => (
                    <div key={item.country} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">{item.flag}</span>
                        <span className="text-sm text-white">{item.country}</span>
                      </div>
                      <span className="text-sm text-gray-400">{item.percentage}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Instagram, Plus, Settings } from "lucide-react"

export function InstagramDashboard() {
  // Mock-Daten für Instagram Accounts
  const accounts = [
    {
      id: "1",
      username: "@imperial_fitness",
      followers: 12500,
      following: 890,
      posts: 234,
      status: "active",
    },
    {
      id: "2",
      username: "@galactic_recipes",
      followers: 8900,
      following: 456,
      posts: 189,
      status: "paused",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Account Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="hologram-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Aktive Accounts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-400">{accounts.length}</div>
          </CardContent>
        </Card>

        <Card className="hologram-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Gesamt Follower</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">
              {accounts.reduce((sum, acc) => sum + acc.followers, 0).toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card className="hologram-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Geplante Posts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-400">15</div>
          </CardContent>
        </Card>
      </div>

      {/* Account List */}
      <Card className="hologram-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-yellow-400">Instagram Accounts</CardTitle>
            <Button className="lightsaber-btn">
              <Plus className="w-4 h-4 mr-2" />
              Account hinzufügen
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {accounts.map((account) => (
              <div
                key={account.id}
                className="flex items-center justify-between p-4 rounded-lg bg-gray-700/50 border border-gray-600"
              >
                <div className="flex items-center space-x-4">
                  <Instagram className="w-8 h-8 text-pink-400" />
                  <div>
                    <h3 className="font-medium text-white">{account.username}</h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-400">
                      <span>{account.followers.toLocaleString()} Follower</span>
                      <span>{account.posts} Posts</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={account.status === "active" ? "status-green" : "status-yellow"}>
                    {account.status === "active" ? "Aktiv" : "Pausiert"}
                  </Badge>
                  <Button variant="ghost" size="sm">
                    <Settings className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

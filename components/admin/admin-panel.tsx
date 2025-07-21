"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, Shield, Activity, Settings } from "lucide-react"

export function AdminPanel() {
  // Mock-Daten für Benutzer
  const [users] = useState([
    {
      id: "1",
      username: "admin",
      name: "Admiral Skywalker",
      email: "admin@galactic.hub",
      isAdmin: true,
      permissions: { instagram: true, youtube: true, statistics: true },
      lastLogin: new Date(),
      status: "online",
    },
    {
      id: "2",
      username: "user1",
      name: "Luke Skywalker",
      email: "user1@galactic.hub",
      isAdmin: false,
      permissions: { instagram: true, youtube: false, statistics: true },
      lastLogin: new Date(Date.now() - 1000 * 60 * 30),
      status: "offline",
    },
    {
      id: "3",
      username: "user2",
      name: "Leia Organa",
      email: "user2@galactic.hub",
      isAdmin: false,
      permissions: { instagram: false, youtube: true, statistics: false },
      lastLogin: new Date(Date.now() - 1000 * 60 * 60 * 2),
      status: "offline",
    },
  ])

  const systemStats = {
    totalUsers: users.length,
    activeUsers: users.filter((u) => u.status === "online").length,
    totalSessions: 47,
    systemUptime: "99.8%",
  }

  return (
    <div className="space-y-6">
      {/* System-Übersicht */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hologram-card">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-400">Gesamt Benutzer</CardTitle>
              <Users className="w-4 h-4 text-yellow-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-400">{systemStats.totalUsers}</div>
          </CardContent>
        </Card>

        <Card className="hologram-card">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-400">Aktive Benutzer</CardTitle>
              <Activity className="w-4 h-4 text-green-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">{systemStats.activeUsers}</div>
          </CardContent>
        </Card>

        <Card className="hologram-card">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-400">Aktive Sessions</CardTitle>
              <Shield className="w-4 h-4 text-blue-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-400">{systemStats.totalSessions}</div>
          </CardContent>
        </Card>

        <Card className="hologram-card">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-400">System Uptime</CardTitle>
              <Settings className="w-4 h-4 text-purple-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-400">{systemStats.systemUptime}</div>
          </CardContent>
        </Card>
      </div>

      {/* Benutzer-Verwaltung */}
      <Card className="hologram-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-red-400">Benutzer-Verwaltung</CardTitle>
            <Button className="sith-btn">
              <Users className="w-4 h-4 mr-2" />
              Neuer Benutzer
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {users.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-4 rounded-lg bg-gray-700/50 border border-gray-600"
              >
                <div className="flex items-center space-x-4">
                  <div
                    className={`w-3 h-3 rounded-full ${user.status === "online" ? "bg-green-400" : "bg-gray-400"}`}
                  />
                  <div>
                    <h3 className="font-medium text-white">
                      {user.name}
                      {user.isAdmin && <Badge className="ml-2 bg-red-600 text-white text-xs">ADMIRAL</Badge>}
                    </h3>
                    <div className="text-sm text-gray-400">
                      @{user.username} • {user.email}
                    </div>
                    <div className="text-xs text-gray-500">
                      Letzte Anmeldung: {user.lastLogin.toLocaleString("de-DE")}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="text-xs text-gray-400">
                    <div>IG: {user.permissions?.instagram ? "✓" : "✗"}</div>
                    <div>YT: {user.permissions?.youtube ? "✓" : "✗"}</div>
                    <div>Stats: {user.permissions?.statistics ? "✓" : "✗"}</div>
                  </div>
                  <Button variant="ghost" size="sm" className="text-yellow-400">
                    Bearbeiten
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

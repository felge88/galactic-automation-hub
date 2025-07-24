"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { Users, Shield, Activity, Settings, Edit, Trash2, Key } from "lucide-react"

interface UserRank {
  id: string
  name: string
  color: string
  icon: string
  permissions: string[]
}

const userRanks: UserRank[] = [
  {
    id: "admiral",
    name: "Admiral",
    color: "from-red-500 to-red-700",
    icon: "👑",
    permissions: ["all"],
  },
  {
    id: "commander",
    name: "Commander",
    color: "from-yellow-500 to-yellow-700",
    icon: "⭐",
    permissions: ["instagram", "youtube", "statistics"],
  },
  {
    id: "captain",
    name: "Captain",
    color: "from-blue-500 to-blue-700",
    icon: "🛡️",
    permissions: ["instagram", "statistics"],
  },
  {
    id: "lieutenant",
    name: "Lieutenant",
    color: "from-green-500 to-green-700",
    icon: "🎖️",
    permissions: ["instagram"],
  },
  {
    id: "recruit",
    name: "Recruit",
    color: "from-gray-500 to-gray-700",
    icon: "🔰",
    permissions: [],
  },
]

export function EnhancedAdminPanel() {
  const [users, setUsers] = useState([
    {
      id: "1",
      username: "admin",
      name: "Admiral Skywalker",
      email: "admin@galactic.hub",
      rank: "admiral",
      permissions: { instagram: true, youtube: true, statistics: true },
      lastLogin: new Date(),
      status: "online",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "2",
      username: "user1",
      name: "Luke Skywalker",
      email: "user1@galactic.hub",
      rank: "commander",
      permissions: { instagram: true, youtube: false, statistics: true },
      lastLogin: new Date(Date.now() - 1000 * 60 * 30),
      status: "offline",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "3",
      username: "user2",
      name: "Leia Organa",
      email: "user2@galactic.hub",
      rank: "captain",
      permissions: { instagram: false, youtube: true, statistics: false },
      lastLogin: new Date(Date.now() - 1000 * 60 * 60 * 2),
      status: "offline",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  ])

  const [editingUser, setEditingUser] = useState<any>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  const handleEditUser = (user: any) => {
    setEditingUser({ ...user })
    setIsEditDialogOpen(true)
  }

  const handleSaveUser = () => {
    setUsers(users.map((u) => (u.id === editingUser.id ? editingUser : u)))
    setIsEditDialogOpen(false)
    setEditingUser(null)
  }

  const handleDeleteUser = (userId: string) => {
    setUsers(users.filter((u) => u.id !== userId))
  }

  const getRankInfo = (rankId: string) => {
    return userRanks.find((r) => r.id === rankId) || userRanks[4]
  }

  const systemStats = {
    totalUsers: users.length,
    activeUsers: users.filter((u) => u.status === "online").length,
    totalSessions: 47,
    systemUptime: "99.8%",
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-orbitron font-bold neon-text mb-4">
          <b>ADMIRAL</b> <i>CONTROL</i> <b>CENTER</b>
        </h1>
        <p className="text-gray-400 text-lg">Imperiale Kommandozentrale</p>
      </div>

      {/* System Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hologram-card">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-400">Gesamt Offiziere</CardTitle>
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
              <CardTitle className="text-sm font-medium text-gray-400">Aktive Offiziere</CardTitle>
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

      {/* User Management */}
      <Card className="hologram-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-red-400 neon-text">
              <b>OFFIZIERS</b> <i>VERWALTUNG</i>
            </CardTitle>
            <Button className="sith-btn">
              <Users className="w-4 h-4 mr-2" />
              Neuer Offizier
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {users.map((user) => {
              const rankInfo = getRankInfo(user.rank)
              return (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-gray-700/50 border border-gray-600 hover:border-yellow-500/50 transition-all"
                >
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <img
                        src={user.avatar || "/placeholder.svg"}
                        alt={user.name}
                        className="w-12 h-12 rounded-full border-2 border-gray-600"
                      />
                      <div
                        className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full ${
                          user.status === "online" ? "bg-green-400" : "bg-gray-400"
                        } border-2 border-gray-800`}
                      />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-medium text-white">{user.name}</h3>
                        <Badge className={`bg-gradient-to-r ${rankInfo.color} text-white shadow-lg`}>
                          {rankInfo.icon} {rankInfo.name}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-400">
                        @{user.username} • {user.email}
                      </div>
                      <div className="text-xs text-gray-500">
                        Letzte Anmeldung: {user.lastLogin.toLocaleString("de-DE")}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="text-xs text-gray-400 text-right">
                      <div className="flex space-x-1">
                        <span className={user.permissions?.instagram ? "text-green-400" : "text-red-400"}>
                          IG {user.permissions?.instagram ? "✓" : "✗"}
                        </span>
                        <span className={user.permissions?.youtube ? "text-green-400" : "text-red-400"}>
                          YT {user.permissions?.youtube ? "✓" : "✗"}
                        </span>
                        <span className={user.permissions?.statistics ? "text-green-400" : "text-red-400"}>
                          Stats {user.permissions?.statistics ? "✓" : "✗"}
                        </span>
                      </div>
                    </div>
                    <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-yellow-400 hover:text-yellow-300"
                          onClick={() => handleEditUser(user)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-gray-800 border-gray-600 text-white">
                        <DialogHeader>
                          <DialogTitle className="text-yellow-400">
                            Offizier bearbeiten: {editingUser?.name}
                          </DialogTitle>
                        </DialogHeader>
                        {editingUser && (
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium mb-2">Name</label>
                              <Input
                                value={editingUser.name}
                                onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                                className="bg-gray-700 border-gray-600"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-2">E-Mail</label>
                              <Input
                                value={editingUser.email}
                                onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                                className="bg-gray-700 border-gray-600"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-2">Rang</label>
                              <select
                                value={editingUser.rank}
                                onChange={(e) => setEditingUser({ ...editingUser, rank: e.target.value })}
                                className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                              >
                                {userRanks.map((rank) => (
                                  <option key={rank.id} value={rank.id}>
                                    {rank.icon} {rank.name}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div className="space-y-3">
                              <label className="block text-sm font-medium">Module-Berechtigungen</label>
                              <div className="flex items-center justify-between">
                                <span>Instagram Module</span>
                                <Switch
                                  checked={editingUser.permissions.instagram}
                                  onCheckedChange={(checked) =>
                                    setEditingUser({
                                      ...editingUser,
                                      permissions: { ...editingUser.permissions, instagram: checked },
                                    })
                                  }
                                />
                              </div>
                              <div className="flex items-center justify-between">
                                <span>YouTube Module</span>
                                <Switch
                                  checked={editingUser.permissions.youtube}
                                  onCheckedChange={(checked) =>
                                    setEditingUser({
                                      ...editingUser,
                                      permissions: { ...editingUser.permissions, youtube: checked },
                                    })
                                  }
                                />
                              </div>
                              <div className="flex items-center justify-between">
                                <span>Statistiken</span>
                                <Switch
                                  checked={editingUser.permissions.statistics}
                                  onCheckedChange={(checked) =>
                                    setEditingUser({
                                      ...editingUser,
                                      permissions: { ...editingUser.permissions, statistics: checked },
                                    })
                                  }
                                />
                              </div>
                            </div>
                            <div className="flex space-x-2 pt-4">
                              <Button onClick={handleSaveUser} className="lightsaber-btn flex-1">
                                Änderungen speichern
                              </Button>
                              <Button
                                variant="outline"
                                className="border-red-500 text-red-400 hover:bg-red-500 hover:text-white bg-transparent"
                              >
                                <Key className="w-4 h-4 mr-2" />
                                Passwort ändern
                              </Button>
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-400 hover:text-red-300"
                      onClick={() => handleDeleteUser(user.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

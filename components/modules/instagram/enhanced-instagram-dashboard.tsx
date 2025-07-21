"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Instagram,
  Plus,
  Settings,
  Edit,
  Trash2,
  Link,
  Calendar,
  BarChart3,
  Users,
  Heart,
  MessageCircle,
  Share,
  TrendingUp,
} from "lucide-react"

interface InstagramAccount {
  id: string
  username: string
  displayName: string
  followers: number
  following: number
  posts: number
  status: "active" | "paused" | "error"
  lastSync: Date
  profilePicture: string
  isVerified: boolean
  engagement: {
    likes: number
    comments: number
    shares: number
    saves: number
  }
  automation: {
    autoPost: boolean
    autoLike: boolean
    autoFollow: boolean
    autoComment: boolean
  }
}

interface ScheduledPost {
  id: string
  accountId: string
  content: string
  media: string[]
  scheduledFor: Date
  status: "scheduled" | "posted" | "failed"
  hashtags: string[]
}

interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  color: string
  requirement: number
  progress: number
  unlocked: boolean
  unlockedAt?: Date
}

export function EnhancedInstagramDashboard() {
  const [accounts, setAccounts] = useState<InstagramAccount[]>([
    {
      id: "1",
      username: "@imperial_fitness",
      displayName: "Imperial Fitness Academy",
      followers: 12500,
      following: 890,
      posts: 234,
      status: "active",
      lastSync: new Date(Date.now() - 1000 * 60 * 15),
      profilePicture: "/placeholder.svg?height=60&width=60",
      isVerified: true,
      engagement: {
        likes: 45230,
        comments: 3420,
        shares: 890,
        saves: 2340,
      },
      automation: {
        autoPost: true,
        autoLike: false,
        autoFollow: true,
        autoComment: false,
      },
    },
    {
      id: "2",
      username: "@galactic_recipes",
      displayName: "Galactic Recipes",
      followers: 8900,
      following: 456,
      posts: 189,
      status: "paused",
      lastSync: new Date(Date.now() - 1000 * 60 * 60 * 2),
      profilePicture: "/placeholder.svg?height=60&width=60",
      isVerified: false,
      engagement: {
        likes: 23450,
        comments: 1890,
        shares: 456,
        saves: 1230,
      },
      automation: {
        autoPost: false,
        autoLike: true,
        autoFollow: false,
        autoComment: true,
      },
    },
  ])

  const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>([
    {
      id: "1",
      accountId: "1",
      content: "Neue Workout-Routine für Jedi-Training! 💪 #fitness #starwars #workout",
      media: ["/placeholder.svg?height=400&width=400"],
      scheduledFor: new Date(Date.now() + 1000 * 60 * 60 * 2),
      status: "scheduled",
      hashtags: ["#fitness", "#starwars", "#workout", "#jedi"],
    },
    {
      id: "2",
      accountId: "2",
      content: "Bantha-Milch Smoothie Rezept 🥤 Perfekt für heiße Tatooine-Tage!",
      media: ["/placeholder.svg?height=400&width=400"],
      scheduledFor: new Date(Date.now() + 1000 * 60 * 60 * 4),
      status: "scheduled",
      hashtags: ["#recipe", "#starwars", "#smoothie", "#tatooine"],
    },
  ])

  const [achievements, setAchievements] = useState<Achievement[]>([
    {
      id: "1",
      name: "Padawan Influencer",
      description: "Erreiche 1.000 Follower",
      icon: "🌟",
      color: "from-blue-500 to-blue-700",
      requirement: 1000,
      progress: 1000,
      unlocked: true,
      unlockedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30),
    },
    {
      id: "2",
      name: "Jedi Knight",
      description: "Erreiche 10.000 Follower",
      icon: "⚔️",
      color: "from-green-500 to-green-700",
      requirement: 10000,
      progress: 12500,
      unlocked: true,
      unlockedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15),
    },
    {
      id: "3",
      name: "Jedi Master",
      description: "Erreiche 50.000 Follower",
      icon: "👑",
      color: "from-purple-500 to-purple-700",
      requirement: 50000,
      progress: 12500,
      unlocked: false,
    },
    {
      id: "4",
      name: "Engagement Meister",
      description: "Erreiche 5% Engagement Rate",
      icon: "💫",
      color: "from-yellow-500 to-yellow-700",
      requirement: 5,
      progress: 4.2,
      unlocked: false,
    },
  ])

  const [selectedAccount, setSelectedAccount] = useState<InstagramAccount | null>(null)
  const [isAccountDialogOpen, setIsAccountDialogOpen] = useState(false)
  const [isAddAccountDialogOpen, setIsAddAccountDialogOpen] = useState(false)
  const [isPostSchedulerOpen, setIsPostSchedulerOpen] = useState(false)

  const handleAccountAction = (account: InstagramAccount, action: string) => {
    switch (action) {
      case "edit":
        setSelectedAccount(account)
        setIsAccountDialogOpen(true)
        break
      case "remove":
        setAccounts(accounts.filter((a) => a.id !== account.id))
        break
      case "reconnect":
        // Simulate reconnection
        setAccounts(
          accounts.map((a) => (a.id === account.id ? { ...a, status: "active" as const, lastSync: new Date() } : a)),
        )
        break
    }
  }

  const toggleAutomation = (accountId: string, feature: keyof InstagramAccount["automation"]) => {
    setAccounts(
      accounts.map((account) =>
        account.id === accountId
          ? {
              ...account,
              automation: {
                ...account.automation,
                [feature]: !account.automation[feature],
              },
            }
          : account,
      ),
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "status-green"
      case "paused":
        return "status-yellow"
      case "error":
        return "status-red"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "Aktiv"
      case "paused":
        return "Pausiert"
      case "error":
        return "Fehler"
      default:
        return "Unbekannt"
    }
  }

  const totalFollowers = accounts.reduce((sum, acc) => sum + acc.followers, 0)
  const totalEngagement = accounts.reduce((sum, acc) => sum + acc.engagement.likes + acc.engagement.comments, 0)
  const activeAccounts = accounts.filter((acc) => acc.status === "active").length

  return (
    <div className="space-y-6">
      {/* Header mit Achievements */}
      <div className="text-center">
        <h1 className="text-4xl font-orbitron font-bold neon-text mb-4">
          <b>INSTAGRAM</b> <i>AUTOMATION</i>
        </h1>
        <p className="text-gray-400 text-lg mb-6">Verwalte deine Instagram-Accounts und Automatisierung</p>

        {/* Achievement Badges */}
        <div className="flex flex-wrap justify-center gap-3 mb-6">
          {achievements
            .filter((a) => a.unlocked)
            .map((achievement) => (
              <div
                key={achievement.id}
                className={`px-4 py-2 rounded-full bg-gradient-to-r ${achievement.color} text-white shadow-lg flex items-center space-x-2 animate-pulse`}
              >
                <span className="text-lg">{achievement.icon}</span>
                <span className="font-medium">{achievement.name}</span>
              </div>
            ))}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hologram-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400 flex items-center">
              <Users className="w-4 h-4 mr-2" />
              Aktive Accounts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-400">{activeAccounts}</div>
          </CardContent>
        </Card>

        <Card className="hologram-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400 flex items-center">
              <TrendingUp className="w-4 h-4 mr-2" />
              Gesamt Follower
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">{totalFollowers.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card className="hologram-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400 flex items-center">
              <Heart className="w-4 h-4 mr-2" />
              Engagement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-pink-400">{totalEngagement.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card className="hologram-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400 flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              Geplante Posts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-400">{scheduledPosts.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="accounts" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-gray-800">
          <TabsTrigger value="accounts">Accounts</TabsTrigger>
          <TabsTrigger value="scheduler">Post Planer</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="achievements">Erfolge</TabsTrigger>
        </TabsList>

        {/* Accounts Tab */}
        <TabsContent value="accounts">
          <Card className="hologram-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-yellow-400 flex items-center">
                  <Instagram className="w-5 h-5 mr-2" />
                  Instagram Accounts
                </CardTitle>
                <Dialog open={isAddAccountDialogOpen} onOpenChange={setIsAddAccountDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="lightsaber-btn">
                      <Plus className="w-4 h-4 mr-2" />
                      Account hinzufügen
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-gray-800 border-gray-600 text-white">
                    <DialogHeader>
                      <DialogTitle className="text-yellow-400">Neuen Instagram Account hinzufügen</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Instagram Username</label>
                        <Input placeholder="@username" className="bg-gray-700 border-gray-600" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Access Token</label>
                        <Input
                          placeholder="Instagram Access Token"
                          type="password"
                          className="bg-gray-700 border-gray-600"
                        />
                      </div>
                      <Button className="w-full lightsaber-btn">Account verbinden</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {accounts.map((account) => (
                  <div
                    key={account.id}
                    className="flex items-center justify-between p-4 rounded-lg bg-gray-700/50 border border-gray-600 hover:border-yellow-500/50 transition-all"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <img
                          src={account.profilePicture || "/placeholder.svg"}
                          alt={account.username}
                          className="w-16 h-16 rounded-full border-2 border-gray-600"
                        />
                        {account.isVerified && (
                          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs">✓</span>
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="font-medium text-white">{account.username}</h3>
                          <Badge className={getStatusColor(account.status)}>{getStatusText(account.status)}</Badge>
                        </div>
                        <p className="text-sm text-gray-400">{account.displayName}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-400 mt-1">
                          <span>{account.followers.toLocaleString()} Follower</span>
                          <span>{account.posts} Posts</span>
                          <span>Sync: {account.lastSync.toLocaleString("de-DE")}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="text-yellow-400">
                            <Settings className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="bg-gray-800 border-gray-600 text-white">
                          <DropdownMenuItem onClick={() => handleAccountAction(account, "edit")}>
                            <Edit className="w-4 h-4 mr-2" />
                            Bearbeiten
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleAccountAction(account, "reconnect")}>
                            <Link className="w-4 h-4 mr-2" />
                            Neu verbinden
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleAccountAction(account, "remove")}
                            className="text-red-400"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Entfernen
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Post Scheduler Tab */}
        <TabsContent value="scheduler">
          <Card className="hologram-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-yellow-400 flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  Post Planer
                </CardTitle>
                <Button className="lightsaber-btn">
                  <Plus className="w-4 h-4 mr-2" />
                  Neuer Post
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {scheduledPosts.map((post) => {
                  const account = accounts.find((a) => a.id === post.accountId)
                  return (
                    <div
                      key={post.id}
                      className="flex items-start space-x-4 p-4 rounded-lg bg-gray-700/50 border border-gray-600"
                    >
                      <img
                        src={post.media[0] || "/placeholder.svg"}
                        alt="Post preview"
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="font-medium text-white">{account?.username}</span>
                          <Badge className="status-blue">Geplant</Badge>
                        </div>
                        <p className="text-sm text-gray-300 mb-2">{post.content}</p>
                        <div className="flex items-center space-x-4 text-xs text-gray-400">
                          <span>📅 {post.scheduledFor.toLocaleString("de-DE")}</span>
                          <span>🏷️ {post.hashtags.length} Hashtags</span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm" className="text-yellow-400">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-400">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {accounts.map((account) => (
              <Card key={account.id} className="hologram-card">
                <CardHeader>
                  <CardTitle className="text-yellow-400 flex items-center">
                    <BarChart3 className="w-5 h-5 mr-2" />
                    {account.username} Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-400">{account.followers.toLocaleString()}</div>
                        <div className="text-sm text-gray-400">Follower</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-400">{account.posts}</div>
                        <div className="text-sm text-gray-400">Posts</div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center space-x-2">
                        <Heart className="w-4 h-4 text-red-400" />
                        <span className="text-sm">{account.engagement.likes.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MessageCircle className="w-4 h-4 text-blue-400" />
                        <span className="text-sm">{account.engagement.comments.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Share className="w-4 h-4 text-green-400" />
                        <span className="text-sm">{account.engagement.shares.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-yellow-400">💾</span>
                        <span className="text-sm">{account.engagement.saves.toLocaleString()}</span>
                      </div>
                    </div>

                    {/* Automation Settings */}
                    <div className="border-t border-gray-600 pt-4">
                      <h4 className="text-sm font-medium text-gray-300 mb-3">Automatisierung</h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Auto-Post</span>
                          <Switch
                            checked={account.automation.autoPost}
                            onCheckedChange={() => toggleAutomation(account.id, "autoPost")}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Auto-Like</span>
                          <Switch
                            checked={account.automation.autoLike}
                            onCheckedChange={() => toggleAutomation(account.id, "autoLike")}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Auto-Follow</span>
                          <Switch
                            checked={account.automation.autoFollow}
                            onCheckedChange={() => toggleAutomation(account.id, "autoFollow")}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Auto-Comment</span>
                          <Switch
                            checked={account.automation.autoComment}
                            onCheckedChange={() => toggleAutomation(account.id, "autoComment")}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Achievements Tab */}
        <TabsContent value="achievements">
          <Card className="hologram-card">
            <CardHeader>
              <CardTitle className="text-yellow-400 flex items-center">
                <span className="text-2xl mr-2">🏆</span>
                Erfolge & Belohnungen
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {achievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className={`p-4 rounded-lg border transition-all ${
                      achievement.unlocked
                        ? `bg-gradient-to-r ${achievement.color} border-transparent shadow-lg`
                        : "bg-gray-700/50 border-gray-600"
                    }`}
                  >
                    <div className="text-center">
                      <div className={`text-4xl mb-2 ${achievement.unlocked ? "animate-bounce" : "grayscale"}`}>
                        {achievement.icon}
                      </div>
                      <h3 className={`font-bold mb-1 ${achievement.unlocked ? "text-white" : "text-gray-400"}`}>
                        {achievement.name}
                      </h3>
                      <p className={`text-sm mb-3 ${achievement.unlocked ? "text-white/80" : "text-gray-500"}`}>
                        {achievement.description}
                      </p>
                      <div className="w-full bg-gray-600 rounded-full h-2 mb-2">
                        <div
                          className={`h-2 rounded-full transition-all ${
                            achievement.unlocked ? "bg-white" : "bg-yellow-400"
                          }`}
                          style={{
                            width: `${Math.min((achievement.progress / achievement.requirement) * 100, 100)}%`,
                          }}
                        />
                      </div>
                      <div className={`text-xs ${achievement.unlocked ? "text-white/60" : "text-gray-400"}`}>
                        {achievement.progress.toLocaleString()} / {achievement.requirement.toLocaleString()}
                      </div>
                      {achievement.unlocked && achievement.unlockedAt && (
                        <div className="text-xs text-white/60 mt-2">
                          Freigeschaltet: {achievement.unlockedAt.toLocaleDateString("de-DE")}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Account Edit Dialog */}
      <Dialog open={isAccountDialogOpen} onOpenChange={setIsAccountDialogOpen}>
        <DialogContent className="bg-gray-800 border-gray-600 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-yellow-400">Account bearbeiten: {selectedAccount?.username}</DialogTitle>
          </DialogHeader>
          {selectedAccount && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Display Name</label>
                  <Input value={selectedAccount.displayName} className="bg-gray-700 border-gray-600" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Status</label>
                  <select className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white">
                    <option value="active">Aktiv</option>
                    <option value="paused">Pausiert</option>
                  </select>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-300 mb-3">Automatisierung Einstellungen</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Auto-Post aktivieren</span>
                    <Switch checked={selectedAccount.automation.autoPost} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Auto-Like aktivieren</span>
                    <Switch checked={selectedAccount.automation.autoLike} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Auto-Follow aktivieren</span>
                    <Switch checked={selectedAccount.automation.autoFollow} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Auto-Comment aktivieren</span>
                    <Switch checked={selectedAccount.automation.autoComment} />
                  </div>
                </div>
              </div>

              <div className="flex space-x-2 pt-4">
                <Button className="lightsaber-btn flex-1">Änderungen speichern</Button>
                <Button
                  variant="outline"
                  className="border-red-500 text-red-400 hover:bg-red-500 hover:text-white bg-transparent"
                  onClick={() => setIsAccountDialogOpen(false)}
                >
                  Abbrechen
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

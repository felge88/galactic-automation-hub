"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { User } from "@/types/user"

interface WelcomeSectionProps {
  user: User
}

interface UserStats {
  totalFollowers: number
  totalPosts: number
  totalDownloads: number
  engagementRate: number
  rank: {
    name: string
    icon: string
    color: string
    nextRank?: string
    progress: number
  }
  achievements: Array<{
    id: string
    name: string
    icon: string
    unlockedAt: Date
  }>
}

const quotes = [
  "Möge die Macht mit dir sein.",
  "Das ist kein Mond... das ist eine Raumstation.",
  "Ich bin dein Vater.",
  "Die Macht ist stark in diesem.",
  "Tu es oder tu es nicht. Es gibt kein Versuchen.",
  "Furcht führt zu Wut, Wut führt zu Hass, Hass führt zu unsäglichem Leid.",
  "In meiner Erfahrung gibt es so etwas wie Glück nicht.",
  "Das ist ein anderer glücklicher Landung.",
]

const ranks = [
  { name: "Youngling", icon: "🌱", color: "from-gray-500 to-gray-700", minFollowers: 0 },
  { name: "Padawan", icon: "🌟", color: "from-blue-500 to-blue-700", minFollowers: 1000 },
  { name: "Jedi Knight", icon: "⚔️", color: "from-green-500 to-green-700", minFollowers: 10000 },
  { name: "Jedi Master", icon: "👑", color: "from-purple-500 to-purple-700", minFollowers: 50000 },
  { name: "Grand Master", icon: "✨", color: "from-yellow-500 to-yellow-700", minFollowers: 100000 },
]

export function EnhancedWelcomeSection({ user }: WelcomeSectionProps) {
  const [currentQuote, setCurrentQuote] = useState(0)
  const [userStats, setUserStats] = useState<UserStats>({
    totalFollowers: 21400,
    totalPosts: 423,
    totalDownloads: 127,
    engagementRate: 4.2,
    rank: {
      name: "Jedi Knight",
      icon: "⚔️",
      color: "from-green-500 to-green-700",
      nextRank: "Jedi Master",
      progress: 42.8,
    },
    achievements: [
      {
        id: "1",
        name: "Erste 1K Follower",
        icon: "🎯",
        unlockedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30),
      },
      {
        id: "2",
        name: "Viral Post",
        icon: "🚀",
        unlockedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15),
      },
      {
        id: "3",
        name: "Engagement Master",
        icon: "💫",
        unlockedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
      },
    ],
  })

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % quotes.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  // Determine current rank based on followers
  const getCurrentRank = (followers: number) => {
    const currentRank = ranks.reverse().find((rank) => followers >= rank.minFollowers) || ranks[0]
    const nextRankIndex = ranks.findIndex((rank) => rank.name === currentRank.name) - 1
    const nextRank = nextRankIndex >= 0 ? ranks[nextRankIndex] : null

    let progress = 100
    if (nextRank) {
      const currentMin = currentRank.minFollowers
      const nextMin = nextRank.minFollowers
      progress = ((followers - currentMin) / (nextMin - currentMin)) * 100
    }

    return {
      ...currentRank,
      nextRank: nextRank?.name,
      progress: Math.min(progress, 100),
    }
  }

  const currentRank = getCurrentRank(userStats.totalFollowers)

  return (
    <div className="space-y-6">
      {/* Main Welcome Card */}
      <Card className="hologram-card floating relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-yellow-500/10 animate-pulse" />
        <CardContent className="p-6 relative z-10">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-4 mb-4">
              <div className="relative">
                <div
                  className={`w-20 h-20 rounded-full bg-gradient-to-r ${currentRank.color} flex items-center justify-center text-3xl animate-bounce`}
                >
                  {currentRank.icon}
                </div>
                <div className="absolute -bottom-2 -right-2 bg-gray-800 rounded-full p-1">
                  <Badge className={`bg-gradient-to-r ${currentRank.color} text-white text-xs`}>
                    {currentRank.name}
                  </Badge>
                </div>
              </div>
              <div className="text-left">
                <h1 className="text-4xl font-orbitron font-bold neon-text">
                  Willkommen, <b>{user.name}</b>!
                </h1>
                <p className="text-xl text-gray-300 glitch-text mt-2">{quotes[currentQuote]}</p>
              </div>
            </div>

            {/* Rank Progress */}
            {currentRank.nextRank && (
              <div className="mt-6">
                <div className="flex items-center justify-between text-sm text-gray-400 mb-2">
                  <span>Fortschritt zu {currentRank.nextRank}</span>
                  <span>{currentRank.progress.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
                  <div
                    className={`h-3 rounded-full bg-gradient-to-r ${currentRank.color} transition-all duration-1000 relative`}
                    style={{ width: `${currentRank.progress}%` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="hologram-card">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-400 mb-1">{userStats.totalFollowers.toLocaleString()}</div>
            <div className="text-sm text-gray-400">Gesamt Follower</div>
          </CardContent>
        </Card>

        <Card className="hologram-card">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-400 mb-1">{userStats.totalPosts}</div>
            <div className="text-sm text-gray-400">Posts erstellt</div>
          </CardContent>
        </Card>

        <Card className="hologram-card">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-400 mb-1">{userStats.totalDownloads}</div>
            <div className="text-sm text-gray-400">Downloads</div>
          </CardContent>
        </Card>

        <Card className="hologram-card">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-400 mb-1">{userStats.engagementRate}%</div>
            <div className="text-sm text-gray-400">Engagement Rate</div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Achievements */}
      <Card className="hologram-card">
        <CardContent className="p-4">
          <h3 className="text-lg font-medium text-yellow-400 mb-4 flex items-center">
            <span className="text-xl mr-2">🏆</span>
            Neueste Erfolge
          </h3>
          <div className="flex space-x-4 overflow-x-auto">
            {userStats.achievements.map((achievement) => (
              <div
                key={achievement.id}
                className="flex-shrink-0 bg-gradient-to-r from-yellow-500/20 to-yellow-700/20 rounded-lg p-3 border border-yellow-500/30 min-w-[200px]"
              >
                <div className="text-center">
                  <div className="text-2xl mb-2 animate-bounce">{achievement.icon}</div>
                  <div className="font-medium text-white text-sm">{achievement.name}</div>
                  <div className="text-xs text-gray-400 mt-1">{achievement.unlockedAt.toLocaleDateString("de-DE")}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

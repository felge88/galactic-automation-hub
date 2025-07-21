"use client"

import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { User } from "@/types/user"
import { cn } from "@/lib/utils"

interface EnhancedModuleGridProps {
  user: User
}

export function EnhancedModuleGrid({ user }: EnhancedModuleGridProps) {
  const modules = [
    {
      key: "instagram",
      title: "Instagram Automation",
      description: "Automatisiere Posts, Stories und Interaktionen",
      href: "/modules/instagram",
      active: user.permissions.instagram,
      coverImage: "/futuristic-instagram-automation.png",
      titleImage: "/instagram-title-logo.png",
      characterImage: "/social-media-robot.png",
      tags: ["Social", "Automation", "Marketing"],
      status: "active",
    },
    {
      key: "youtube",
      title: "YouTube Downloader",
      description: "Lade Videos und Audio in allen Formaten herunter",
      href: "/modules/youtube",
      active: user.permissions.youtube,
      coverImage: "/youtube-downloader-dark.png",
      titleImage: "/youtube-title-logo.png",
      characterImage: "/download-bot.png",
      tags: ["Media", "Download", "Content"],
      status: "active",
    },
    {
      key: "tiktok",
      title: "TikTok Manager",
      description: "Verwalte TikTok Content und Analytics",
      href: "/modules/tiktok",
      active: false,
      coverImage: "/tiktok-manager-interface.png",
      titleImage: "/tiktok-title-logo.png",
      characterImage: "/generic-social-media-character.png",
      tags: ["Social", "Video", "Trending"],
      status: "coming_soon",
    },
    {
      key: "ai_content",
      title: "AI Content Creator",
      description: "Erstelle Content mit künstlicher Intelligenz",
      href: "/modules/ai-content",
      active: false,
      coverImage: "/ai-content-creator-interface.png",
      titleImage: "/placeholder.svg?height=60&width=200",
      characterImage: "/placeholder.svg?height=200&width=150",
      tags: ["AI", "Content", "Creative"],
      status: "beta",
    },
  ]

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-orbitron font-bold neon-text mb-4">
          <b>GALAKTISCHE</b> <i>MODULE</i>
        </h1>
        <p className="text-gray-400 text-lg">Wähle deine Automatisierungsmodule</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {modules.map((module) => {
          const content = (
            <div key={module.key} className={cn("module-card", !module.active && "module-card-disabled")}>
              <div className="module-wrapper">
                <img src={module.coverImage || "/placeholder.svg"} alt={module.title} className="cover-image" />
                <div className="module-overlay">
                  <div className="module-tags">
                    {module.tags.map((tag) => (
                      <Badge key={tag} className="module-tag">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="module-status">
                    <Badge
                      className={cn(
                        "status-badge",
                        module.status === "active" && "status-green",
                        module.status === "beta" && "status-yellow",
                        module.status === "coming_soon" && "status-blue",
                      )}
                    >
                      {module.status === "active" && "Aktiv"}
                      {module.status === "beta" && "Beta"}
                      {module.status === "coming_soon" && "Bald verfügbar"}
                    </Badge>
                  </div>
                </div>
              </div>
              <img
                src={module.titleImage || "/placeholder.svg"}
                alt={`${module.title} Title`}
                className="title-image"
              />
              <img
                src={module.characterImage || "/placeholder.svg"}
                alt={`${module.title} Character`}
                className="character-image"
              />

              <div className="module-info">
                <h3 className="module-title">{module.title}</h3>
                <p className="module-description">{module.description}</p>
                {module.active && <Button className="module-button lightsaber-btn">Modul starten</Button>}
              </div>
            </div>
          )

          return module.active ? (
            <Link key={module.key} href={module.href} className="block">
              {content}
            </Link>
          ) : (
            <div key={module.key} className="relative">
              {content}
              {!module.active && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
                  <div className="text-center">
                    <p className="text-white font-medium mb-2">Modul gesperrt</p>
                    <p className="text-gray-300 text-sm">Kontaktiere einen Admiral</p>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

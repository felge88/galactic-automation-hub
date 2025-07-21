"use client"

import Link from "next/link"
import { Instagram, Youtube } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import type { User } from "@/types/user"
import { cn } from "@/lib/utils"

interface ModuleGridProps {
  user: User
}

/**
 * Zeigt alle verfügbaren Automatisierungsmodule an.
 * Aktivierte Module sind klickbar, deaktivierte werden ausgegraut.
 */
export function ModuleGrid({ user }: ModuleGridProps) {
  const modules = [
    {
      key: "instagram",
      title: "Instagram Automation",
      description: "Posts planen, Accounts verwalten u.v.m.",
      href: "/modules/instagram",
      active: user.permissions.instagram,
      icon: Instagram,
    },
    {
      key: "youtube",
      title: "YouTube Downloader",
      description: "Videos & Audio in allen Auflösungen speichern.",
      href: "/modules/youtube",
      active: user.permissions?.youtube || false,
      icon: Youtube,
    },
  ] as const

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
      {modules.map((mod) => {
        const Icon = mod.icon
        const content = (
          <Card
            key={mod.key}
            className={cn(
              "h-full transition-all hover:shadow-lg",
              mod.active ? "cursor-pointer hover:border-yellow-600" : "opacity-50 cursor-not-allowed hover:shadow-none",
            )}
          >
            <CardHeader>
              <div className="flex items-center gap-3">
                <Icon className="w-6 h-6 text-yellow-400" />
                <CardTitle className="text-lg">{mod.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-400">{mod.description}</p>
            </CardContent>
          </Card>
        )

        return mod.active ? (
          <Link key={mod.key} href={mod.href} className="block">
            {content}
          </Link>
        ) : (
          <div key={mod.key}>{content}</div>
        )
      })}
    </div>
  )
}

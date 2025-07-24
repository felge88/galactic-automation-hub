"use client"
import { Button } from "@/components/ui/button"
import type { User } from "@/types/user"
import { logout } from "@/lib/auth"
import { useRouter } from "next/navigation"
import { SidebarTrigger } from "@/components/ui/sidebar" // Importiere SidebarTrigger

interface HeaderProps {
  user: User
}

export function Header({ user }: HeaderProps) {
  const router = useRouter()

  const handleLogout = async () => {
    await logout()
    router.push("/login")
  }

  return (
    <header className="bg-gray-800 border-b border-gray-600 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          {/* SidebarTrigger für mobile Ansicht und Desktop */}
          <SidebarTrigger className="mr-4" /> {/* 'lg:hidden' entfernt */}
          <div className="hidden lg:block">
            <h1 className="text-2xl font-orbitron font-bold text-yellow-400">Imperiales Kommando</h1>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-300">Willkommen, {user.name}</span>
          <Button variant="outline" size="sm" onClick={handleLogout} className="sith-btn bg-transparent">
            Abmelden
          </Button>
        </div>
      </div>
    </header>
  )
}

"use client"

import type React from "react"
import { Header } from "./header"
import { useAuth } from "@/hooks/use-auth"
import { useSidebar } from "@/components/ui/sidebar" // Importiere useSidebar
import { cn } from "@/lib/utils" // Importiere cn für bedingte Klassen

interface MainLayoutProps {
  children: React.ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  const { user, loading } = useAuth()
  const { state, isMobile } = useSidebar() // Hole den Sidebar-Status und ob mobil

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-space-dark text-white">
        <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
        <span className="ml-4 text-xl">Lade Kommandozentrale...</span>
      </div>
    )
  }

  if (!user) {
    return null
  }

  // Dynamische Margin-Klassen basierend auf dem Sidebar-Status
  // Die CSS-Variablen werden von der SidebarProvider gesetzt und in sidebar.tsx definiert
  const mainContentStyle = !isMobile
    ? {
        marginLeft: state === "expanded" ? "var(--sidebar-width)" : "var(--sidebar-width-icon)",
        transition: "margin-left 0.2s ease-linear", // Für sanfte Animation
      }
    : {}

  return (
    <div className={cn("flex-1 flex flex-col", !isMobile && "md:ml-[var(--sidebar-width)]")} style={mainContentStyle}>
      <Header user={user} />
      <main className="flex-1 overflow-auto p-6 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="starfield-overlay"></div>
        {children}
      </main>
    </div>
  )
}

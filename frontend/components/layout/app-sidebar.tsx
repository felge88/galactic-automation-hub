"use client"

import { Badge } from "@/components/ui/badge"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { HomeIcon, CubeIcon, ChartBarIcon, CogIcon, ShieldCheckIcon } from "@heroicons/react/24/outline"
import { cn } from "@/lib/utils"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar"
import { useAuth } from "@/hooks/use-auth" // Importiere useAuth

type AppSidebarProps = {}

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: HomeIcon },
  { name: "Module", href: "/modules", icon: CubeIcon },
  { name: "Statistiken", href: "/statistics", icon: ChartBarIcon },
  { name: "Einstellungen", href: "/settings", icon: CogIcon },
]

export function AppSidebar({}: AppSidebarProps) {
  const pathname = usePathname()
  const { user } = useAuth() // Hole den Benutzer über den AuthContext
  const { state } = useSidebar() // Hole den Sidebar-Status

  if (!user) {
    return null // Oder einen Lade-Spinner, falls der Benutzer noch geladen wird
  }

  return (
    <Sidebar collapsible="icon">
      {" "}
      {/* collapsible="icon" für die einklappbare Funktionalität */}
      <SidebarHeader>
        <div className="flex items-center justify-center h-16 px-4 border-b border-gray-700">
          {state === "expanded" && (
            <h1 className="text-xl font-orbitron font-bold neon-text">
              <b>IMPERIAL</b>ES <i>KOMMANDO</i>
            </h1>
          )}
          {state === "collapsed" && (
            <h1 className="text-xl font-orbitron font-bold neon-text">
              <b>IK</b>
            </h1>
          )}
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigation.map((item) => {
                const isActive = pathname.startsWith(item.href)
                return (
                  <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton asChild isActive={isActive} tooltip={item.name}>
                      <Link
                        href={item.href}
                        className={cn(
                          "group", // Füge group hinzu, damit Tooltip funktioniert
                          isActive
                            ? "bg-yellow-600 text-white shadow-neon-yellow"
                            : "text-gray-300 hover:bg-gray-700 hover:text-white hover:shadow-lg",
                        )}
                      >
                        <item.icon
                          className={cn("w-5 h-5 transition-colors", isActive ? "text-white" : "text-yellow-400")}
                        />
                        <span>{item.name}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}

              {user.isAdmin && (
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={pathname.startsWith("/admin")} tooltip="Admiral Control">
                    <Link
                      href="/admin"
                      className={cn(
                        "group", // Füge group hinzu
                        pathname.startsWith("/admin")
                          ? "bg-red-600 text-white shadow-neon-red"
                          : "text-gray-300 hover:bg-gray-700 hover:text-white hover:shadow-lg",
                      )}
                    >
                      <ShieldCheckIcon
                        className={cn(
                          "w-5 h-5 transition-colors",
                          pathname.startsWith("/admin") ? "text-white" : "text-red-400",
                        )}
                      />
                      <span>Admiral Control</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip={user.name}>
              <div className="flex items-center">
                <div
                  className={cn(
                    "w-8 h-8 rounded-full bg-gradient-to-r flex items-center justify-center text-white font-bold text-sm",
                    user.isAdmin ? "from-red-500 to-red-700" : "from-blue-500 to-blue-700",
                  )}
                >
                  {user.name.charAt(0)}
                </div>
                <span>
                  {user.name}
                  {user.isAdmin && (
                    <Badge className="ml-2 px-2 py-1 text-xs bg-red-600 text-white rounded-full shadow-neon-red">
                      ADMIRAL
                    </Badge>
                  )}
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail /> {/* Der Rail-Bereich zum Aufklappen/Einklappen */}
    </Sidebar>
  )
}

import type React from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { SidebarProvider } from "@/components/ui/sidebar" // SidebarInset entfernt
import { AppSidebar } from "@/components/layout/app-sidebar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider defaultOpen={false}>
      <div className="flex min-h-screen">
        {" "}
        {/* Flex-Container für Sidebar und Hauptinhalt */}
        <AppSidebar />
        <MainLayout>{children}</MainLayout>
      </div>
    </SidebarProvider>
  )
}

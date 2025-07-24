import { getCurrentUser } from "@/lib/auth"
import { redirect } from "next/navigation"
import { EnhancedAdminPanel } from "@/components/admin/enhanced-admin-panel"

export default async function AdminPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  if (user.role !== 'ADMIN') {
    redirect("/dashboard")
  }

  return <EnhancedAdminPanel />
}

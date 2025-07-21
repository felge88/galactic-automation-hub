import { getCurrentUser } from "@/lib/auth"
import { redirect } from "next/navigation"
import { EnhancedSettingsPanel } from "@/components/settings/enhanced-settings-panel"

export default async function SettingsPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  return <EnhancedSettingsPanel user={user} />
}

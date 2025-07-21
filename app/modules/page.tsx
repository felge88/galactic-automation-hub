import { getCurrentUser } from "@/lib/auth"
import { redirect } from "next/navigation"
import { EnhancedModuleGrid } from "@/components/modules/enhanced-module-grid"

export default async function ModulesPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  return <EnhancedModuleGrid user={user} />
}

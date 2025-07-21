"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { login } from "@/lib/auth"

export default function LoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = await login(username, password)
      if (result.success) {
        toast({
          title: "Zugang gewährt",
          description: "Willkommen im Imperialen Kommando, Commander.",
        })
        router.push("/dashboard")
      } else {
        toast({
          title: "Zugang verweigert",
          description: "Ungültige Anmeldedaten. Versuchen Sie es erneut.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Systemfehler",
        description: "Ein unerwarteter Fehler ist aufgetreten.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Spektakulärer Star Wars Hintergrund */}
      <div className="starwars-bg"></div>
      <div className="nebula-field"></div>
      <div className="hyperspace-stars"></div>

      {/* Raumschiffe und Effekte */}
      <div className="millennium-falcon"></div>
      <div className="death-star-hologram"></div>

      <div className="x-wing-squadron">
        <div className="x-wing"></div>
        <div className="x-wing"></div>
        <div className="x-wing"></div>
      </div>

      {/* Professioneller Login Container */}
      <div className="min-h-screen flex items-center justify-center p-6 relative z-10">
        <div className="w-full max-w-md">
          <div className="starwars-login-container p-8">
            {/* Imperial Crest */}
            <div className="imperial-crest"></div>

            {/* Titel */}
            <h1 className="starwars-title">IMPERIALES KOMMANDO</h1>
            <p className="starwars-subtitle">Galaktische Automatisierungszentrale</p>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="starwars-input"
                  placeholder="Offizier-Kennung"
                />
              </div>

              <div>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="starwars-input"
                  placeholder="Sicherheitscode"
                />
              </div>

              <Button type="submit" className="w-full starwars-button" disabled={isLoading}>
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-3">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Authentifizierung läuft...</span>
                  </div>
                ) : (
                  "Zugang anfordern"
                )}
              </Button>
            </form>

            {/* Status Panel */}
            <div className="status-panel">
              <div className="status-item">
                <div className="status-dot"></div>
                <span>System Online</span>
              </div>
              <div className="status-item">
                <div className="status-dot"></div>
                <span>Sicher Verbunden</span>
              </div>
            </div>
          </div>

          {/* Info Text */}
          <div className="text-center mt-6">
            <p className="text-white/60 text-sm">Nach der Anmeldung verwenden Sie die Sidebar zur Navigation</p>
          </div>
        </div>
      </div>
    </div>
  )
}

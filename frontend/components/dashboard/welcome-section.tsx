"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import type { User } from "@/types/user"

interface WelcomeSectionProps {
  user: User
}

const quotes = [
  "Möge die Macht mit dir sein.",
  "Das ist kein Mond... das ist eine Raumstation.",
  "Ich bin dein Vater.",
  "Die Macht ist stark in diesem.",
  "Tu es oder tu es nicht. Es gibt kein Versuchen.",
  "Furcht führt zu Wut, Wut führt zu Hass, Hass führt zu unsäglichem Leid.",
]

export function WelcomeSection({ user }: WelcomeSectionProps) {
  const [currentQuote, setCurrentQuote] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % quotes.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <Card className="hologram-card floating">
      <CardContent className="p-6">
        <div className="text-center">
          <h1 className="text-4xl font-orbitron font-bold neon-glow text-blue-400 mb-4">Willkommen, {user.name}!</h1>
          <p className="text-xl text-gray-300 glitch-text">{quotes[currentQuote]}</p>
        </div>
      </CardContent>
    </Card>
  )
}

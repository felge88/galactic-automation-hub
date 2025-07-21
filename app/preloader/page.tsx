"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function PreloaderPage() {
  const [progress, setProgress] = useState(0)
  const router = useRouter()

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setTimeout(() => router.push("/login"), 3000) // Erhöhte Verzögerung auf 3 Sekunden
          return 100
        }
        return prev + Math.random() * 5 // Langsamerer Fortschritt
      })
    }, 200)

    return () => clearInterval(interval)
  }, [router])

  return (
    <div className="starwars-preloader">
      <div className="stars-bg"></div>
      <div className="death-star-loader"></div>

      <div className="preloader-content">
        <div className="imperial-logo">
          <div className="logo-ring"></div>
          <div className="logo-center">⬢</div>
        </div>

        <h1 className="preloader-title neon-text">
          <b>IMPERIAL</b>ES <i>KOMMANDO</i>
        </h1>

        <div className="loading-bar">
          <div className="loading-progress" style={{ width: `${progress}%` }}></div>
        </div>

        <p className="loading-text">Initialisiere galaktische Systeme... {Math.round(progress)}%</p>

        <div className="millennium-falcon-loader"></div>
      </div>
    </div>
  )
}

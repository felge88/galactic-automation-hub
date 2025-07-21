import type React from "react"
import type { Metadata } from "next"
import { Orbitron } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/components/providers/auth-provider"
import { Toaster } from "@/components/ui/toaster"

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
})

export const metadata: Metadata = {
  title: "Imperiales Kommando",
  description: "Imperiale Kommandozentrale für Social Media Automatisierung",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="de" className="dark">
      <body className={`${orbitron.variable} font-sans bg-space-dark text-white min-h-screen`}>
        <div className="starfield-bg">
          <AuthProvider>
            {children}
            <Toaster />
          </AuthProvider>
        </div>
      </body>
    </html>
  )
}

"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { User, Shield, Bell, Database } from "lucide-react"
import type { User as UserType } from "@/types/user"

interface SettingsPanelProps {
  user: UserType
}

export function SettingsPanel({ user }: SettingsPanelProps) {
  const [name, setName] = useState(user.name)
  const [email, setEmail] = useState(user.email)

  const createdAt = new Date(user.createdAt)
  const lastLogin = user.lastLogin ? new Date(user.lastLogin) : null

  return (
    <div className="space-y-6">
      {/* Profil-Einstellungen */}
      <Card className="hologram-card">
        <CardHeader>
          <CardTitle className="text-yellow-400 flex items-center">
            <User className="w-5 h-5 mr-2" />
            Profil-Einstellungen
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Name</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} className="bg-gray-700 border-gray-600" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">E-Mail</label>
            <Input value={email} onChange={(e) => setEmail(e.target.value)} className="bg-gray-700 border-gray-600" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Benutzername</label>
            <Input value={user.username} disabled className="bg-gray-600 border-gray-500 text-gray-400" />
          </div>
          <Button className="lightsaber-btn">Änderungen speichern</Button>
        </CardContent>
      </Card>

      {/* Berechtigungen */}
      <Card className="hologram-card">
        <CardHeader>
          <CardTitle className="text-yellow-400 flex items-center">
            <Shield className="w-5 h-5 mr-2" />
            Berechtigungen
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-300">Instagram Module</span>
              <Badge className={user.permissions.instagram ? "status-green" : "status-red"}>
                {user.permissions.instagram ? "Aktiviert" : "Deaktiviert"}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-300">YouTube Module</span>
              <Badge className={user.permissions.youtube ? "status-green" : "status-red"}>
                {user.permissions.youtube ? "Aktiviert" : "Deaktiviert"}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-300">Statistiken</span>
              <Badge className={user.permissions.statistics ? "status-green" : "status-red"}>
                {user.permissions.statistics ? "Aktiviert" : "Deaktiviert"}
              </Badge>
            </div>
            {user.isAdmin && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-300">Administrator</span>
                <Badge className="bg-red-600 text-white">Admiral</Badge>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Benachrichtigungen */}
      <Card className="hologram-card">
        <CardHeader>
          <CardTitle className="text-yellow-400 flex items-center">
            <Bell className="w-5 h-5 mr-2" />
            Benachrichtigungen
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-300">E-Mail Benachrichtigungen</span>
              <Badge className="status-green">Aktiviert</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-300">Push Benachrichtigungen</span>
              <Badge className="status-yellow">Pausiert</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-300">Sicherheitswarnungen</span>
              <Badge className="status-green">Aktiviert</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* System-Info */}
      <Card className="hologram-card">
        <CardHeader>
          <CardTitle className="text-yellow-400 flex items-center">
            <Database className="w-5 h-5 mr-2" />
            System-Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Registriert seit:</span>
              <span className="text-white">{createdAt.toLocaleDateString("de-DE")}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Letzte Anmeldung:</span>
              <span className="text-white">{lastLogin ? lastLogin.toLocaleDateString("de-DE") : "Nie"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Benutzer-ID:</span>
              <span className="text-white font-mono">{user.id}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

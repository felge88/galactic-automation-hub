"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { User, Shield, Bell, Database, Key, Palette, Download, Upload, Trash2, Eye, EyeOff } from "lucide-react"
import type { User as UserType } from "@/types/user"

interface SettingsPanelProps {
  user: UserType
}

interface APIKey {
  id: string
  name: string
  service: string
  key: string
  status: "active" | "expired" | "invalid"
  lastUsed: Date
  createdAt: Date
}

interface NotificationSettings {
  email: boolean
  push: boolean
  security: boolean
  marketing: boolean
  updates: boolean
}

export function EnhancedSettingsPanel({ user }: SettingsPanelProps) {
  const [name, setName] = useState(user.name)
  const [email, setEmail] = useState(user.email)
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPasswords, setShowPasswords] = useState(false)
  const [profileImage, setProfileImage] = useState("/placeholder.svg?height=100&width=100")
  const [theme, setTheme] = useState("dark")
  const [language, setLanguage] = useState("de")
  const [timezone, setTimezone] = useState("Europe/Berlin")

  const [apiKeys, setApiKeys] = useState<APIKey[]>([
    {
      id: "1",
      name: "Instagram API",
      service: "Instagram",
      key: "ig_****_****_****_1234",
      status: "active",
      lastUsed: new Date(Date.now() - 1000 * 60 * 30),
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30),
    },
    {
      id: "2",
      name: "YouTube API",
      service: "YouTube",
      key: "yt_****_****_****_5678",
      status: "active",
      lastUsed: new Date(Date.now() - 1000 * 60 * 60 * 2),
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15),
    },
    {
      id: "3",
      name: "TikTok API",
      service: "TikTok",
      key: "tt_****_****_****_9012",
      status: "expired",
      lastUsed: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 60),
    },
  ])

  const [notifications, setNotifications] = useState<NotificationSettings>({
    email: true,
    push: false,
    security: true,
    marketing: false,
    updates: true,
  })

  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false)
  const [isApiKeyDialogOpen, setIsApiKeyDialogOpen] = useState(false)

  const createdAt = new Date(user.createdAt)
  const lastLogin = user.lastLogin ? new Date(user.lastLogin) : null

  const handlePasswordChange = () => {
    if (newPassword !== confirmPassword) {
      alert("Passwörter stimmen nicht überein!")
      return
    }
    // Simulate password change
    setIsPasswordDialogOpen(false)
    setCurrentPassword("")
    setNewPassword("")
    setConfirmPassword("")
  }

  const handleProfileImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setProfileImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const getApiKeyStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "status-green"
      case "expired":
        return "status-yellow"
      case "invalid":
        return "status-red"
      default:
        return "bg-gray-500"
    }
  }

  const getApiKeyStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "Aktiv"
      case "expired":
        return "Abgelaufen"
      case "invalid":
        return "Ungültig"
      default:
        return "Unbekannt"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-orbitron font-bold neon-text mb-4">
          <b>SYSTEM</b> <i>EINSTELLUNGEN</i>
        </h1>
        <p className="text-gray-400 text-lg">Verwalte dein Profil und Systemkonfiguration</p>
      </div>

      {/* Settings Tabs */}
      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6 bg-gray-800">
          <TabsTrigger value="profile">Profil</TabsTrigger>
          <TabsTrigger value="security">Sicherheit</TabsTrigger>
          <TabsTrigger value="api">API Keys</TabsTrigger>
          <TabsTrigger value="notifications">Benachrichtigungen</TabsTrigger>
          <TabsTrigger value="appearance">Darstellung</TabsTrigger>
          <TabsTrigger value="data">Daten</TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="hologram-card">
              <CardHeader>
                <CardTitle className="text-yellow-400 flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Profil-Informationen
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Profile Image */}
                <div className="text-center">
                  <div className="relative inline-block">
                    <img
                      src={profileImage || "/placeholder.svg"}
                      alt="Profilbild"
                      className="w-24 h-24 rounded-full border-4 border-yellow-400 object-cover"
                    />
                    <label className="absolute bottom-0 right-0 bg-yellow-400 rounded-full p-2 cursor-pointer hover:bg-yellow-500 transition-colors">
                      <Upload className="w-4 h-4 text-black" />
                      <input type="file" accept="image/*" onChange={handleProfileImageUpload} className="hidden" />
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Name</label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-gray-700 border-gray-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">E-Mail</label>
                  <Input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-gray-700 border-gray-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Benutzername</label>
                  <Input value={user.username} disabled className="bg-gray-600 border-gray-500 text-gray-400" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Sprache</label>
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger className="bg-gray-700 border-gray-600">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-700 border-gray-600">
                      <SelectItem value="de">Deutsch</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="fr">Français</SelectItem>
                      <SelectItem value="es">Español</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Zeitzone</label>
                  <Select value={timezone} onValueChange={setTimezone}>
                    <SelectTrigger className="bg-gray-700 border-gray-600">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-700 border-gray-600">
                      <SelectItem value="Europe/Berlin">Europa/Berlin</SelectItem>
                      <SelectItem value="Europe/London">Europa/London</SelectItem>
                      <SelectItem value="America/New_York">Amerika/New York</SelectItem>
                      <SelectItem value="Asia/Tokyo">Asien/Tokyo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button className="w-full lightsaber-btn">Änderungen speichern</Button>
              </CardContent>
            </Card>

            <Card className="hologram-card">
              <CardHeader>
                <CardTitle className="text-yellow-400 flex items-center">
                  <Shield className="w-5 h-5 mr-2" />
                  Berechtigungen & Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-300">Instagram Module</span>
                    <Badge className={user.permissions?.instagram ? "status-green" : "status-red"}>
                      {user.permissions?.instagram ? "Aktiviert" : "Deaktiviert"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-300">YouTube Module</span>
                    <Badge className={user.permissions?.youtube ? "status-green" : "status-red"}>
                      {user.permissions?.youtube ? "Aktiviert" : "Deaktiviert"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-300">Statistiken</span>
                    <Badge className={user.permissions?.statistics ? "status-green" : "status-red"}>
                      {user.permissions?.statistics ? "Aktiviert" : "Deaktiviert"}
                    </Badge>
                  </div>
                  {user.isAdmin && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-300">Administrator</span>
                      <Badge className="bg-red-600 text-white shadow-neon-red">Admiral</Badge>
                    </div>
                  )}

                  <div className="border-t border-gray-600 pt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Registriert seit:</span>
                      <span className="text-white">{createdAt.toLocaleDateString("de-DE")}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Letzte Anmeldung:</span>
                      <span className="text-white">{lastLogin ? lastLogin.toLocaleDateString("de-DE") : "Nie"}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Benutzer-ID:</span>
                      <span className="text-white font-mono">{user.id}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="hologram-card">
              <CardHeader>
                <CardTitle className="text-yellow-400 flex items-center">
                  <Key className="w-5 h-5 mr-2" />
                  Passwort & Sicherheit
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="w-full lightsaber-btn">
                      <Key className="w-4 h-4 mr-2" />
                      Passwort ändern
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-gray-800 border-gray-600 text-white">
                    <DialogHeader>
                      <DialogTitle className="text-yellow-400">Passwort ändern</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Aktuelles Passwort</label>
                        <div className="relative">
                          <Input
                            type={showPasswords ? "text" : "password"}
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            className="bg-gray-700 border-gray-600 pr-10"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPasswords(!showPasswords)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                          >
                            {showPasswords ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Neues Passwort</label>
                        <Input
                          type={showPasswords ? "text" : "password"}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="bg-gray-700 border-gray-600"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Passwort bestätigen</label>
                        <Input
                          type={showPasswords ? "text" : "password"}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="bg-gray-700 border-gray-600"
                        />
                      </div>
                      <div className="flex space-x-2 pt-4">
                        <Button onClick={handlePasswordChange} className="lightsaber-btn flex-1">
                          Passwort ändern
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => setIsPasswordDialogOpen(false)}
                          className="border-gray-600 text-gray-400"
                        >
                          Abbrechen
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-300">Zwei-Faktor-Authentifizierung</span>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-300">Login-Benachrichtigungen</span>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-300">Verdächtige Aktivitäten melden</span>
                    <Switch defaultChecked />
                  </div>
                </div>

                <Button
                  variant="outline"
                  className="w-full border-red-500 text-red-400 hover:bg-red-500 hover:text-white bg-transparent"
                >
                  Von allen Geräten abmelden
                </Button>
              </CardContent>
            </Card>

            <Card className="hologram-card">
              <CardHeader>
                <CardTitle className="text-yellow-400">Aktive Sessions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-gray-700/50 rounded-lg border border-green-500/50">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-white">Aktuelle Session</div>
                        <div className="text-sm text-gray-400">Chrome auf Windows • Berlin, Deutschland</div>
                      </div>
                      <Badge className="status-green">Aktiv</Badge>
                    </div>
                  </div>
                  <div className="p-3 bg-gray-700/50 rounded-lg border border-gray-600">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-white">Mobile App</div>
                        <div className="text-sm text-gray-400">iPhone • vor 2 Stunden</div>
                      </div>
                      <Button variant="ghost" size="sm" className="text-red-400">
                        Beenden
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* API Keys Tab */}
        <TabsContent value="api">
          <Card className="hologram-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-yellow-400 flex items-center">
                  <Key className="w-5 h-5 mr-2" />
                  API Schlüssel Verwaltung
                </CardTitle>
                <Dialog open={isApiKeyDialogOpen} onOpenChange={setIsApiKeyDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="lightsaber-btn">
                      <Key className="w-4 h-4 mr-2" />
                      Neuer API Key
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-gray-800 border-gray-600 text-white">
                    <DialogHeader>
                      <DialogTitle className="text-yellow-400">Neuen API Key hinzufügen</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Service</label>
                        <Select>
                          <SelectTrigger className="bg-gray-700 border-gray-600">
                            <SelectValue placeholder="Service auswählen" />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-700 border-gray-600">
                            <SelectItem value="instagram">Instagram</SelectItem>
                            <SelectItem value="youtube">YouTube</SelectItem>
                            <SelectItem value="tiktok">TikTok</SelectItem>
                            <SelectItem value="twitter">Twitter</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Name</label>
                        <Input placeholder="z.B. Instagram Haupt-Account" className="bg-gray-700 border-gray-600" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">API Schlüssel</label>
                        <Input placeholder="API Key eingeben" className="bg-gray-700 border-gray-600" />
                      </div>
                      <Button className="w-full lightsaber-btn">API Key hinzufügen</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {apiKeys.map((apiKey) => (
                  <div
                    key={apiKey.id}
                    className="flex items-center justify-between p-4 rounded-lg bg-gray-700/50 border border-gray-600"
                  >
                    <div className="flex items-center space-x-4">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          apiKey.status === "active"
                            ? "bg-green-400"
                            : apiKey.status === "expired"
                              ? "bg-yellow-400"
                              : "bg-red-400"
                        }`}
                      />
                      <div>
                        <h3 className="font-medium text-white">{apiKey.name}</h3>
                        <div className="text-sm text-gray-400">
                          {apiKey.service} • {apiKey.key}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          Erstellt: {apiKey.createdAt.toLocaleDateString("de-DE")} • Zuletzt verwendet:{" "}
                          {apiKey.lastUsed.toLocaleDateString("de-DE")}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getApiKeyStatusColor(apiKey.status)}>
                        {getApiKeyStatusText(apiKey.status)}
                      </Badge>
                      <Button variant="ghost" size="sm" className="text-yellow-400">
                        <Key className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-400">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications">
          <Card className="hologram-card">
            <CardHeader>
              <CardTitle className="text-yellow-400 flex items-center">
                <Bell className="w-5 h-5 mr-2" />
                Benachrichtigungseinstellungen
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-white">E-Mail Benachrichtigungen</div>
                      <div className="text-sm text-gray-400">Erhalte wichtige Updates per E-Mail</div>
                    </div>
                    <Switch
                      checked={notifications.email}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, email: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-white">Push Benachrichtigungen</div>
                      <div className="text-sm text-gray-400">Browser-Benachrichtigungen aktivieren</div>
                    </div>
                    <Switch
                      checked={notifications.push}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, push: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-white">Sicherheitswarnungen</div>
                      <div className="text-sm text-gray-400">Benachrichtigungen bei verdächtigen Aktivitäten</div>
                    </div>
                    <Switch
                      checked={notifications.security}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, security: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-white">Marketing E-Mails</div>
                      <div className="text-sm text-gray-400">Produktupdates und Angebote</div>
                    </div>
                    <Switch
                      checked={notifications.marketing}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, marketing: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-white">System Updates</div>
                      <div className="text-sm text-gray-400">Benachrichtigungen über neue Features</div>
                    </div>
                    <Switch
                      checked={notifications.updates}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, updates: checked })}
                    />
                  </div>
                </div>
                <Button className="w-full lightsaber-btn">Einstellungen speichern</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appearance Tab */}
        <TabsContent value="appearance">
          <Card className="hologram-card">
            <CardHeader>
              <CardTitle className="text-yellow-400 flex items-center">
                <Palette className="w-5 h-5 mr-2" />
                Darstellung & Design
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">Theme</label>
                <div className="grid grid-cols-3 gap-4">
                  <div
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      theme === "dark" ? "border-yellow-400 bg-yellow-400/10" : "border-gray-600"
                    }`}
                    onClick={() => setTheme("dark")}
                  >
                    <div className="w-full h-16 bg-gray-900 rounded mb-2"></div>
                    <div className="text-center text-sm">Dark Mode</div>
                  </div>
                  <div
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      theme === "light" ? "border-yellow-400 bg-yellow-400/10" : "border-gray-600"
                    }`}
                    onClick={() => setTheme("light")}
                  >
                    <div className="w-full h-16 bg-white rounded mb-2"></div>
                    <div className="text-center text-sm">Light Mode</div>
                  </div>
                  <div
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      theme === "auto" ? "border-yellow-400 bg-yellow-400/10" : "border-gray-600"
                    }`}
                    onClick={() => setTheme("auto")}
                  >
                    <div className="w-full h-16 bg-gradient-to-r from-gray-900 to-white rounded mb-2"></div>
                    <div className="text-center text-sm">Auto</div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-white">Animationen aktivieren</div>
                    <div className="text-sm text-gray-400">Smooth Übergänge und Effekte</div>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-white">Neon-Effekte</div>
                    <div className="text-sm text-gray-400">Star Wars Leuchteffekte</div>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-white">Hintergrund-Animationen</div>
                    <div className="text-sm text-gray-400">Sterne und Raumschiffe</div>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>

              <Button className="w-full lightsaber-btn">Darstellung speichern</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Data Tab */}
        <TabsContent value="data">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="hologram-card">
              <CardHeader>
                <CardTitle className="text-yellow-400 flex items-center">
                  <Database className="w-5 h-5 mr-2" />
                  Daten-Management
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full lightsaber-btn">
                  <Download className="w-4 h-4 mr-2" />
                  Alle Daten exportieren
                </Button>
                <Button className="w-full lightsaber-btn">
                  <Upload className="w-4 h-4 mr-2" />
                  Daten importieren
                </Button>
                <div className="border-t border-gray-600 pt-4">
                  <h4 className="font-medium text-white mb-3">Datenschutz</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-300">Analytics sammeln</span>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-300">Crash Reports senden</span>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-300">Nutzungsdaten teilen</span>
                      <Switch />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hologram-card border-red-500/50">
              <CardHeader>
                <CardTitle className="text-red-400 flex items-center">
                  <Trash2 className="w-5 h-5 mr-2" />
                  Gefährliche Aktionen
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                  <h4 className="font-medium text-red-400 mb-2">Account löschen</h4>
                  <p className="text-sm text-gray-300 mb-4">
                    Diese Aktion kann nicht rückgängig gemacht werden. Alle deine Daten werden permanent gelöscht.
                  </p>
                  <Button
                    variant="outline"
                    className="w-full border-red-500 text-red-400 hover:bg-red-500 hover:text-white bg-transparent"
                  >
                    Account permanent löschen
                  </Button>
                </div>
                <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                  <h4 className="font-medium text-yellow-400 mb-2">Alle Daten löschen</h4>
                  <p className="text-sm text-gray-300 mb-4">
                    Löscht alle gespeicherten Daten, aber behält den Account.
                  </p>
                  <Button
                    variant="outline"
                    className="w-full border-yellow-500 text-yellow-400 hover:bg-yellow-500 hover:text-black bg-transparent"
                  >
                    Daten zurücksetzen
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

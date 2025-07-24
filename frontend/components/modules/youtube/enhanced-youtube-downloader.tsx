"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Download,
  Youtube,
  Play,
  Pause,
  Trash2,
  FolderOpen,
  Settings,
  FileVideo,
  FileAudio,
  ImageIcon,
} from "lucide-react"

interface DownloadItem {
  id: string
  title: string
  url: string
  thumbnail: string
  duration: string
  status: "queued" | "downloading" | "completed" | "failed" | "paused"
  format: string
  quality: string
  size: string
  progress: number
  downloadedAt?: Date
  filePath?: string
}

interface DownloadSettings {
  defaultFormat: "mp4" | "mp3" | "webm"
  defaultQuality: string
  downloadPath: string
  autoStart: boolean
  maxConcurrent: number
}

export function EnhancedYouTubeDownloader() {
  const [url, setUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [selectedItems, setSelectedItems] = useState<string[]>([])

  const [downloads, setDownloads] = useState<DownloadItem[]>([
    {
      id: "1",
      title: "Star Wars Theme - Epic Orchestra Version",
      url: "https://youtube.com/watch?v=example1",
      thumbnail: "/placeholder.svg?height=90&width=160",
      duration: "4:32",
      status: "completed",
      format: "MP4",
      quality: "1080p",
      size: "45.2 MB",
      progress: 100,
      downloadedAt: new Date(Date.now() - 1000 * 60 * 30),
      filePath: "/downloads/star-wars-theme.mp4",
    },
    {
      id: "2",
      title: "Imperial March - 10 Hours Extended",
      url: "https://youtube.com/watch?v=example2",
      thumbnail: "/placeholder.svg?height=90&width=160",
      duration: "10:00:00",
      status: "downloading",
      format: "MP3",
      quality: "320kbps",
      size: "125.8 MB",
      progress: 67,
    },
    {
      id: "3",
      title: "Jedi Training Meditation Music",
      url: "https://youtube.com/watch?v=example3",
      thumbnail: "/placeholder.svg?height=90&width=160",
      duration: "1:23:45",
      status: "queued",
      format: "MP4",
      quality: "720p",
      size: "89.3 MB",
      progress: 0,
    },
    {
      id: "4",
      title: "Cantina Band - Full Album",
      url: "https://youtube.com/watch?v=example4",
      thumbnail: "/placeholder.svg?height=90&width=160",
      duration: "45:12",
      status: "failed",
      format: "MP3",
      quality: "192kbps",
      size: "62.1 MB",
      progress: 23,
    },
  ])

  const [settings, setSettings] = useState<DownloadSettings>({
    defaultFormat: "mp4",
    defaultQuality: "1080p",
    downloadPath: "/downloads",
    autoStart: true,
    maxConcurrent: 3,
  })

  const [isSettingsOpen, setIsSettingsOpen] = useState(false)

  const handleDownload = async () => {
    if (!url) return

    setIsLoading(true)

    // Simulate API call to get video info
    setTimeout(() => {
      const newDownload: DownloadItem = {
        id: Date.now().toString(),
        title: "Neues Video - " + url.split("v=")[1]?.substring(0, 8) || "Unknown",
        url,
        thumbnail: "/placeholder.svg?height=90&width=160",
        duration: "3:45",
        status: settings.autoStart ? "downloading" : "queued",
        format: settings.defaultFormat.toUpperCase(),
        quality: settings.defaultQuality,
        size: "Unknown",
        progress: 0,
      }

      setDownloads([newDownload, ...downloads])
      setUrl("")
      setIsLoading(false)
    }, 2000)
  }

  const handleBatchAction = (action: string) => {
    switch (action) {
      case "start":
        setDownloads(
          downloads.map((d) =>
            selectedItems.includes(d.id) && (d.status === "queued" || d.status === "paused")
              ? { ...d, status: "downloading" as const }
              : d,
          ),
        )
        break
      case "pause":
        setDownloads(
          downloads.map((d) =>
            selectedItems.includes(d.id) && d.status === "downloading" ? { ...d, status: "paused" as const } : d,
          ),
        )
        break
      case "remove":
        setDownloads(downloads.filter((d) => !selectedItems.includes(d.id)))
        setSelectedItems([])
        break
    }
  }

  const toggleItemSelection = (id: string) => {
    setSelectedItems((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "status-green"
      case "downloading":
        return "status-blue"
      case "queued":
        return "status-yellow"
      case "paused":
        return "status-yellow"
      case "failed":
        return "status-red"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "completed":
        return "Fertig"
      case "downloading":
        return "Lädt..."
      case "queued":
        return "Warteschlange"
      case "paused":
        return "Pausiert"
      case "failed":
        return "Fehler"
      default:
        return "Unbekannt"
    }
  }

  const getFormatIcon = (format: string) => {
    switch (format.toLowerCase()) {
      case "mp4":
      case "webm":
        return <FileVideo className="w-4 h-4" />
      case "mp3":
        return <FileAudio className="w-4 h-4" />
      default:
        return <ImageIcon className="w-4 h-4" />
    }
  }

  const stats = {
    total: downloads.length,
    completed: downloads.filter((d) => d.status === "completed").length,
    downloading: downloads.filter((d) => d.status === "downloading").length,
    failed: downloads.filter((d) => d.status === "failed").length,
    totalSize: downloads.reduce((sum, d) => {
      const size = Number.parseFloat(d.size.replace(/[^\d.]/g, "")) || 0
      return sum + size
    }, 0),
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-orbitron font-bold neon-text mb-4">
          <b>YOUTUBE</b> <i>DOWNLOADER</i>
        </h1>
        <p className="text-gray-400 text-lg">Lade Videos und Audio in allen Formaten herunter</p>
      </div>

      {/* Download Form */}
      <Card className="hologram-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-yellow-400 flex items-center">
              <Youtube className="w-5 h-5 mr-2" />
              Video/Audio Download
            </CardTitle>
            <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="text-gray-400">
                  <Settings className="w-4 h-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-gray-800 border-gray-600 text-white">
                <DialogHeader>
                  <DialogTitle className="text-yellow-400">Download Einstellungen</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Standard Format</label>
                    <Select
                      value={settings.defaultFormat}
                      onValueChange={(value: any) => setSettings({ ...settings, defaultFormat: value })}
                    >
                      <SelectTrigger className="bg-gray-700 border-gray-600">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-700 border-gray-600">
                        <SelectItem value="mp4">MP4 (Video)</SelectItem>
                        <SelectItem value="mp3">MP3 (Audio)</SelectItem>
                        <SelectItem value="webm">WebM (Video)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Standard Qualität</label>
                    <Select
                      value={settings.defaultQuality}
                      onValueChange={(value) => setSettings({ ...settings, defaultQuality: value })}
                    >
                      <SelectTrigger className="bg-gray-700 border-gray-600">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-700 border-gray-600">
                        <SelectItem value="1080p">1080p</SelectItem>
                        <SelectItem value="720p">720p</SelectItem>
                        <SelectItem value="480p">480p</SelectItem>
                        <SelectItem value="320kbps">320kbps (Audio)</SelectItem>
                        <SelectItem value="192kbps">192kbps (Audio)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Download Pfad</label>
                    <div className="flex space-x-2">
                      <Input
                        value={settings.downloadPath}
                        onChange={(e) => setSettings({ ...settings, downloadPath: e.target.value })}
                        className="bg-gray-700 border-gray-600"
                      />
                      <Button variant="outline" size="sm">
                        <FolderOpen className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={settings.autoStart}
                      onCheckedChange={(checked) => setSettings({ ...settings, autoStart: !!checked })}
                    />
                    <label className="text-sm">Downloads automatisch starten</label>
                  </div>
                  <Button className="w-full lightsaber-btn">Einstellungen speichern</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4">
            <Input
              placeholder="YouTube URL eingeben..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="flex-1"
            />
            <Button onClick={handleDownload} disabled={!url || isLoading} className="lightsaber-btn">
              {isLoading ? (
                <div className="flex items-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Analysiere...
                </div>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="hologram-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Gesamt Downloads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-400">{stats.total}</div>
          </CardContent>
        </Card>

        <Card className="hologram-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Abgeschlossen</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">{stats.completed}</div>
          </CardContent>
        </Card>

        <Card className="hologram-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Aktive Downloads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-400">{stats.downloading}</div>
          </CardContent>
        </Card>

        <Card className="hologram-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Fehlgeschlagen</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-400">{stats.failed}</div>
          </CardContent>
        </Card>

        <Card className="hologram-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Gespeichert</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-400">{stats.totalSize.toFixed(1)} GB</div>
          </CardContent>
        </Card>
      </div>

      {/* Downloads Management */}
      <Tabs defaultValue="all" className="space-y-6">
        <div className="flex items-center justify-between">
          <TabsList className="bg-gray-800">
            <TabsTrigger value="all">Alle ({stats.total})</TabsTrigger>
            <TabsTrigger value="downloading">Aktiv ({stats.downloading})</TabsTrigger>
            <TabsTrigger value="completed">Fertig ({stats.completed})</TabsTrigger>
            <TabsTrigger value="failed">Fehler ({stats.failed})</TabsTrigger>
          </TabsList>

          {selectedItems.length > 0 && (
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleBatchAction("start")}
                className="border-green-500 text-green-400"
              >
                <Play className="w-4 h-4 mr-2" />
                Starten ({selectedItems.length})
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleBatchAction("pause")}
                className="border-yellow-500 text-yellow-400"
              >
                <Pause className="w-4 h-4 mr-2" />
                Pausieren
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleBatchAction("remove")}
                className="border-red-500 text-red-400"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Entfernen
              </Button>
            </div>
          )}
        </div>

        <TabsContent value="all">
          <Card className="hologram-card">
            <CardHeader>
              <CardTitle className="text-yellow-400">Download Verlauf</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {downloads.map((download) => (
                  <div
                    key={download.id}
                    className="flex items-center space-x-4 p-4 rounded-lg bg-gray-700/50 border border-gray-600 hover:border-yellow-500/50 transition-all"
                  >
                    <Checkbox
                      checked={selectedItems.includes(download.id)}
                      onCheckedChange={() => toggleItemSelection(download.id)}
                    />
                    <img
                      src={download.thumbnail || "/placeholder.svg"}
                      alt={download.title}
                      className="w-20 h-12 rounded object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-white truncate">{download.title}</h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-400 mt-1">
                        <div className="flex items-center space-x-1">
                          {getFormatIcon(download.format)}
                          <span>
                            {download.format} {download.quality}
                          </span>
                        </div>
                        <span>⏱️ {download.duration}</span>
                        <span>📦 {download.size}</span>
                        {download.downloadedAt && <span>📅 {download.downloadedAt.toLocaleDateString("de-DE")}</span>}
                      </div>
                      {download.status === "downloading" && (
                        <div className="w-full bg-gray-600 rounded-full h-2 mt-2">
                          <div
                            className="bg-blue-400 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${download.progress}%` }}
                          />
                        </div>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getStatusColor(download.status)}>{getStatusText(download.status)}</Badge>
                      {download.status === "completed" && (
                        <Button variant="ghost" size="sm" className="text-green-400">
                          <FolderOpen className="w-4 h-4" />
                        </Button>
                      )}
                      {download.status === "downloading" && (
                        <Button variant="ghost" size="sm" className="text-yellow-400">
                          <Pause className="w-4 h-4" />
                        </Button>
                      )}
                      {(download.status === "queued" || download.status === "paused") && (
                        <Button variant="ghost" size="sm" className="text-green-400">
                          <Play className="w-4 h-4" />
                        </Button>
                      )}
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

        <TabsContent value="downloading">
          <Card className="hologram-card">
            <CardContent>
              <div className="space-y-4">
                {downloads
                  .filter((d) => d.status === "downloading")
                  .map((download) => (
                    <div key={download.id} className="p-4 rounded-lg bg-gray-700/50 border border-blue-500">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium text-white">{download.title}</h3>
                        <Badge className="status-blue">Lädt... {download.progress}%</Badge>
                      </div>
                      <div className="w-full bg-gray-600 rounded-full h-3">
                        <div
                          className="bg-blue-400 h-3 rounded-full transition-all duration-300 relative overflow-hidden"
                          style={{ width: `${download.progress}%` }}
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="completed">
          <Card className="hologram-card">
            <CardContent>
              <div className="space-y-4">
                {downloads
                  .filter((d) => d.status === "completed")
                  .map((download) => (
                    <div
                      key={download.id}
                      className="flex items-center justify-between p-4 rounded-lg bg-gray-700/50 border border-green-500"
                    >
                      <div className="flex items-center space-x-4">
                        <img
                          src={download.thumbnail || "/placeholder.svg"}
                          alt={download.title}
                          className="w-16 h-10 rounded object-cover"
                        />
                        <div>
                          <h3 className="font-medium text-white">{download.title}</h3>
                          <div className="text-sm text-gray-400">
                            {download.format} {download.quality} • {download.size}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className="status-green">Fertig</Badge>
                        <Button variant="ghost" size="sm" className="text-green-400">
                          <FolderOpen className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="failed">
          <Card className="hologram-card">
            <CardContent>
              <div className="space-y-4">
                {downloads
                  .filter((d) => d.status === "failed")
                  .map((download) => (
                    <div
                      key={download.id}
                      className="flex items-center justify-between p-4 rounded-lg bg-gray-700/50 border border-red-500"
                    >
                      <div className="flex items-center space-x-4">
                        <img
                          src={download.thumbnail || "/placeholder.svg"}
                          alt={download.title}
                          className="w-16 h-10 rounded object-cover grayscale"
                        />
                        <div>
                          <h3 className="font-medium text-white">{download.title}</h3>
                          <div className="text-sm text-red-400">Download fehlgeschlagen bei {download.progress}%</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className="status-red">Fehler</Badge>
                        <Button variant="ghost" size="sm" className="text-yellow-400">
                          <Play className="w-4 h-4" />
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
      </Tabs>
    </div>
  )
}

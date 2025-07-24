"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Download, Youtube } from "lucide-react"

export function YouTubeDownloader() {
  const [url, setUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // Mock-Daten für Downloads
  const downloads = [
    {
      id: "1",
      title: "Star Wars Theme - Epic Orchestra Version",
      url: "https://youtube.com/watch?v=example1",
      status: "completed",
      format: "MP4 1080p",
      size: "45.2 MB",
    },
    {
      id: "2",
      title: "Imperial March - 10 Hours",
      url: "https://youtube.com/watch?v=example2",
      status: "downloading",
      format: "MP3 320kbps",
      size: "125.8 MB",
      progress: 67,
    },
  ]

  const handleDownload = async () => {
    if (!url) return

    setIsLoading(true)
    // Simuliere Download-Prozess
    setTimeout(() => {
      setIsLoading(false)
      setUrl("")
    }, 2000)
  }

  return (
    <div className="space-y-6">
      {/* Download Form */}
      <Card className="hologram-card">
        <CardHeader>
          <CardTitle className="text-yellow-400 flex items-center">
            <Youtube className="w-5 h-5 mr-2" />
            Video/Audio Download
          </CardTitle>
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
                  Lädt...
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

      {/* Download Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="hologram-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Gesamt Downloads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-400">127</div>
          </CardContent>
        </Card>

        <Card className="hologram-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Aktive Downloads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-400">3</div>
          </CardContent>
        </Card>

        <Card className="hologram-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Gespeichert</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">2.4 GB</div>
          </CardContent>
        </Card>
      </div>

      {/* Download History */}
      <Card className="hologram-card">
        <CardHeader>
          <CardTitle className="text-yellow-400">Download Verlauf</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {downloads.map((download) => (
              <div
                key={download.id}
                className="flex items-center justify-between p-4 rounded-lg bg-gray-700/50 border border-gray-600"
              >
                <div className="flex items-center space-x-4">
                  <Youtube className="w-8 h-8 text-red-400" />
                  <div className="flex-1">
                    <h3 className="font-medium text-white">{download.title}</h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-400">
                      <span>{download.format}</span>
                      <span>{download.size}</span>
                    </div>
                    {download.progress && (
                      <div className="w-full bg-gray-600 rounded-full h-2 mt-2">
                        <div
                          className="bg-blue-400 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${download.progress}%` }}
                        ></div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge
                    className={
                      download.status === "completed"
                        ? "status-green"
                        : download.status === "downloading"
                          ? "status-yellow"
                          : "status-red"
                    }
                  >
                    {download.status === "completed"
                      ? "Fertig"
                      : download.status === "downloading"
                        ? "Lädt..."
                        : "Fehler"}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

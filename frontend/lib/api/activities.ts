// Placeholder API functions for activities

export interface Activity {
  id: string
  type: "login" | "logout" | "post" | "download"
  description: string
  timestamp: Date
  device?: string
  location?: string
  suspicious?: boolean
}

export async function getRecentActivities(): Promise<Activity[]> {
  // Placeholder - implement with real API call
  return [
    {
      id: "1",
      type: "login",
      description: "Anmeldung erfolgreich",
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
      device: "Chrome auf Windows",
      location: "Berlin, Deutschland",
      suspicious: false,
    },
    {
      id: "2",
      type: "post",
      description: "Instagram Post veröffentlicht",
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      suspicious: false,
    },
    {
      id: "3",
      type: "login",
      description: "Verdächtige Anmeldung",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
      device: "Safari auf iPhone",
      location: "Moskau, Russland",
      suspicious: true,
    },
  ]
}

export async function logActivity(activity: Omit<Activity, "id" | "timestamp">): Promise<void> {
  // Placeholder - implement with real logging
  console.log("Logging activity:", activity)
}

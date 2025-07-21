export interface User {
  id: string
  username: string
  email: string
  name: string
  isAdmin: boolean
  permissions: {
    instagram: boolean
    youtube: boolean
    statistics: boolean
  }
  lastLogin?: Date
  createdAt: Date
}

export interface UserActivity {
  id: string
  userId: string
  type: "login" | "logout" | "action"
  description: string
  timestamp: Date
  ipAddress?: string
  userAgent?: string
  location?: string
  suspicious?: boolean
}

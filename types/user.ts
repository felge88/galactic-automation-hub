export type Role = 'USER' | 'ADMIN' | 'ADMIRAL';
export type Rank = 'NONE' | 'VIP' | 'ELITE';

export interface User {
  id: number;
  email: string;
  name: string;
  role: Role;
  rank: Rank;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthUser extends User {
  permissions?: {
    instagram: boolean;
    youtube: boolean;
    statistics: boolean;
  };
  isAdmin?: boolean;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface ApiError {
  error: string;
  message?: string;
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

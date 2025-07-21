import { apiClient } from '@/lib/api/client';

export interface User {
  id: number;
  username: string;
  email: string;
  name: string;
  role: 'USER' | 'ADMIN' | 'ADMIRAL';
  rank: 'NONE' | 'VIP' | 'ELITE';
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface LoginResponse {
  token: string;
  user: User;
}

export async function getCurrentUser(): Promise<User | null> {
  if (typeof window === "undefined") return null;

  const token = localStorage.getItem("auth_token");
  if (!token) return null;

  try {
    // Validate token with backend and get current user
    const response = await apiClient.get<User>('/api/user/me');
    
    if (response.error) {
      // Token is invalid, remove it
      localStorage.removeItem("auth_token");
      return null;
    }

    const userData = response.data;
    if (userData) {
      // Add computed isAdmin property
      (userData as any).isAdmin = userData.role === 'ADMIN' || userData.role === 'ADMIRAL';
    }
    return userData || null;
  } catch {
    localStorage.removeItem("auth_token");
    return null;
  }
}

export async function login(
  username: string,
  password: string,
): Promise<{
  success: boolean;
  error?: string;
  user?: User;
}> {
  try {
    const response = await apiClient.post<LoginResponse>('/api/login', {
      username,
      password,
    });

    if (response.error) {
      return {
        success: false,
        error: response.error,
      };
    }

    if (response.data) {
      // Store token in localStorage
      localStorage.setItem("auth_token", response.data.token);
      
      return {
        success: true,
        user: response.data.user,
      };
    }

    return {
      success: false,
      error: 'Unexpected response format',
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Login failed',
    };
  }
}

export async function register(
  username: string,
  email: string,
  password: string,
  name: string,
): Promise<{
  success: boolean;
  error?: string;
  user?: Partial<User>;
}> {
  try {
    const response = await apiClient.post('/api/register', {
      username,
      email,
      password,
      name,
    });

    if (response.error) {
      return {
        success: false,
        error: response.error,
      };
    }

    return {
      success: true,
      user: response.data,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Registration failed',
    };
  }
}

export async function logout(): Promise<void> {
  if (typeof window !== "undefined") {
    localStorage.removeItem("auth_token");
    // Optionally call backend logout endpoint
    try {
      await apiClient.post('/api/logout');
    } catch {
      // Ignore logout errors
    }
  }
}

export function isAuthenticated(): boolean {
  if (typeof window === "undefined") return false;
  return !!localStorage.getItem("auth_token");
}

export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("auth_token");
}

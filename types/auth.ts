export interface ExtendedUser {
  id: number;
  username: string;
  email: string;
  name: string;
  role: 'USER' | 'ADMIN' | 'ADMIRAL';
  rank: 'NONE' | 'VIP' | 'ELITE';
  image?: string;
  createdAt: Date;
  updatedAt: Date;
  isAdmin?: boolean;
  lastLogin?: string | Date;
  permissions?: {
    instagram: boolean;
    youtube: boolean;
    statistics: boolean;
  };
}
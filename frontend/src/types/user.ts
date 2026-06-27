export type UserRole = "super_admin" | "admin" | "operator" | "responder" | "viewer";

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatarUrl?: string;
  phoneNumber?: string;
  department?: string;
  lastActiveAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserSession {
  token: string;
  expiresAt: string;
  user: UserProfile;
}

export interface UserSettings {
  theme: "light" | "dark" | "system";
  emailNotifications: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;
  mfaEnabled: boolean;
}

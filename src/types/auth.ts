export type UserRole = 'owner' | 'manager' | 'warden' | 'resident';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  avatar?: string;
  propertyName?: string;
}

export interface LoginCredentials {
  email: string;
  password?: string;
  rememberMe?: boolean;
}

export interface SignupCredentials {
  name: string;
  email: string;
  phone: string;
  propertyName: string;
  password: string;
}

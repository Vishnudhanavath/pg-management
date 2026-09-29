export type UserRole = 'owner' | 'manager' | 'staff' | 'warden' | 'resident';

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
  role: UserRole;
  password: string;
}

import { create } from 'zustand';
import type { User, UserRole, SignupCredentials } from '../types/auth';
import { toast } from './useToastStore';
import { authApi, setAuthToken, clearAuthToken } from '../lib/api';

interface AuthStoreState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password?: string, role?: UserRole) => Promise<boolean>;
  loginWithOtp: (phone: string, otp: string) => Promise<boolean>;
  loginWithGoogle: () => Promise<boolean>;
  signup: (credentials: SignupCredentials) => Promise<boolean>;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
}

const STORAGE_KEY = 'mana_pg_auth_user';

const getInitialUser = (): User | null => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Failed to parse auth user from storage', e);
  }
  return null;
};

export const DEMO_ACCOUNTS = [
  {
    role: 'owner' as UserRole,
    name: 'Chandu (Owner)',
    email: 'owner@manapg.com',
    password: 'password123',
    propertyName: 'MANA Executive PG - Hitec City',
    badge: 'Owner / Admin',
    description: 'Full access to all properties, finances, and settings',
  },
  {
    role: 'manager' as UserRole,
    name: 'Ravi Kumar',
    email: 'manager@manapg.com',
    password: 'password123',
    propertyName: 'MANA Luxury PG - Madhapur',
    badge: 'Property Warden',
    description: 'Manage daily check-ins, complaints, and rooms',
  },
  {
    role: 'resident' as UserRole,
    name: 'Karthik Reddy',
    email: 'resident@manapg.com',
    password: 'password123',
    propertyName: 'MANA Executive PG - Room 204',
    badge: 'Resident / Guest',
    description: 'View rent invoices, food menu, and service tickets',
  },
];

const initialUser = getInitialUser();

export const useAuthStore = create<AuthStoreState>((set, get) => ({
  user: initialUser,
  isAuthenticated: !!initialUser,
  isLoading: false,

  login: async (emailOrUsername: string, password = '', role: UserRole = 'owner') => {
    set({ isLoading: true });

    try {
      // 1. Attempt API Login: POST /api/v1/auth/login
      const response = await authApi.login({
        username: emailOrUsername.trim(),
        password: password,
      });

      if (response && response.access_token) {
        // Save Bearer token to localStorage
        setAuthToken(response.access_token);

        const matchedDemo = DEMO_ACCOUNTS.find(
          (acc) => acc.email.toLowerCase() === emailOrUsername.toLowerCase()
        );

        const user: User = {
          id: response.user?.id || `user-${Date.now()}`,
          name:
            response.user?.full_name ||
            (matchedDemo ? matchedDemo.name : emailOrUsername.split('@')[0].toUpperCase()),
          email: response.user?.email || emailOrUsername.trim(),
          role: ((response.user?.role as UserRole) || (matchedDemo ? matchedDemo.role : role)),
          propertyName: matchedDemo ? matchedDemo.propertyName : 'MANA Executive PG',
          avatar: (response.user?.full_name || emailOrUsername).charAt(0).toUpperCase(),
        };

        localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
        set({ user, isAuthenticated: true, isLoading: false });
        toast.success(`Welcome back, ${user.name}!`, 'Signed in successfully via API.');
        return true;
      }
    } catch (err: any) {
      if (err.message === 'BACKEND_UNREACHABLE') {
        // Backend not currently running: Fallback gracefully to offline demo session
        const matchedDemo = DEMO_ACCOUNTS.find(
          (acc) => acc.email.toLowerCase() === emailOrUsername.toLowerCase()
        );

        const user: User = {
          id: `user-${Date.now()}`,
          name: matchedDemo ? matchedDemo.name : emailOrUsername.split('@')[0].toUpperCase() || 'PG Manager',
          email: emailOrUsername.trim(),
          role: matchedDemo ? matchedDemo.role : role,
          propertyName: matchedDemo ? matchedDemo.propertyName : 'MANA Executive PG',
          avatar: matchedDemo ? matchedDemo.name.charAt(0) : emailOrUsername.charAt(0).toUpperCase(),
        };

        localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
        set({ user, isAuthenticated: true, isLoading: false });
        toast.info(
          'FastAPI Backend Offline',
          'Logged into demo mode. Start your backend at port 8000 for live data.'
        );
        return true;
      } else {
        // Explicit API error (e.g. 401 Unauthorized or invalid credentials)
        set({ isLoading: false });
        toast.error('Login Failed', err.message || 'Invalid username or password.');
        return false;
      }
    }

    set({ isLoading: false });
    return false;
  },

  loginWithOtp: async (phone: string, otp: string) => {
    set({ isLoading: true });
    await new Promise((resolve) => setTimeout(resolve, 700));

    if (otp !== '123456' && otp.length !== 6) {
      set({ isLoading: false });
      toast.error('Invalid OTP', 'Please enter the 6-digit code sent to your phone (Demo: 123456).');
      return false;
    }

    const user: User = {
      id: `user-${Date.now()}`,
      name: 'Mobile User',
      email: `${phone.replace(/\D/g, '')}@mobile.manapg.com`,
      phone: phone,
      role: 'owner',
      propertyName: 'MANA Executive PG',
      avatar: 'M',
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    set({ user, isAuthenticated: true, isLoading: false });
    toast.success('Verified successfully!', 'Signed in via mobile OTP.');
    return true;
  },

  loginWithGoogle: async () => {
    set({ isLoading: true });
    await new Promise((resolve) => setTimeout(resolve, 800));

    const user: User = {
      id: `user-google-${Date.now()}`,
      name: 'Google User',
      email: 'chandu.google@example.com',
      role: 'owner',
      propertyName: 'MANA Executive PG',
      avatar: 'G',
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    set({ user, isAuthenticated: true, isLoading: false });
    toast.success('Signed in with Google', `Welcome back, ${user.name}!`);
    return true;
  },

  signup: async (credentials: SignupCredentials) => {
    set({ isLoading: true });

    try {
      // 1. Call API POST /api/v1/auth/register
      const payload = {
        full_name: credentials.name,
        mobile_number: credentials.phone || '',
        email: credentials.email,
        password: credentials.password,
      };

      const result = await authApi.register(payload);

      // If backend returns access_token immediately on register
      if (result && result.access_token) {
        setAuthToken(result.access_token);
      }

      const user: User = {
        id: result?.user?.id || result?.id || `user-${Date.now()}`,
        name: credentials.name,
        email: credentials.email,
        phone: credentials.phone,
        role: 'owner',
        propertyName: credentials.propertyName || 'My New PG Property',
        avatar: credentials.name.charAt(0).toUpperCase(),
      };

      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      set({ user, isAuthenticated: true, isLoading: false });
      toast.success('Account Created Successfully!', `Welcome to MANA P.G, ${user.name}!`);
      return true;
    } catch (err: any) {
      if (err.message === 'BACKEND_UNREACHABLE') {
        // Backend not running: Fallback gracefully to offline demo account
        const user: User = {
          id: `user-${Date.now()}`,
          name: credentials.name,
          email: credentials.email,
          phone: credentials.phone,
          role: 'owner',
          propertyName: credentials.propertyName || 'My New PG Property',
          avatar: credentials.name.charAt(0).toUpperCase(),
        };

        localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
        set({ user, isAuthenticated: true, isLoading: false });
        toast.info(
          'FastAPI Backend Offline',
          'Demo account created locally. Run your FastAPI backend on port 8000 for live persistence.'
        );
        return true;
      } else {
        // Explicit API error (e.g. email already exists, validation error)
        set({ isLoading: false });
        toast.error('Registration Failed', err.message || 'Could not complete registration.');
        return false;
      }
    }
  },

  logout: () => {
    const prevName = get().user?.name || 'User';
    clearAuthToken();
    localStorage.removeItem(STORAGE_KEY);
    set({ user: null, isAuthenticated: false, isLoading: false });
    toast.info('Logged out', `See you soon, ${prevName}.`);
  },

  updateUser: (data: Partial<User>) => {
    const currentUser = get().user;
    if (!currentUser) return;
    const updated = { ...currentUser, ...data };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    set({ user: updated });
    toast.success('Profile updated');
  },
}));


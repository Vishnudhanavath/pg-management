/**
 * Central API Client and Auth Service
 * Integrates with FastAPI Identity & Auth Module (/api/v1/auth/...)
 */

export const API_BASE_URL =
  import.meta.env.VITE_API_URL || '/api/v1';

export interface RegisterPayload {
  full_name: string;
  mobile_number: string;
  email: string;
  password: string;
  role?: string;
}

export interface LoginPayload {
  username: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  user?: {
    id?: string;
    full_name?: string;
    email?: string;
    mobile_number?: string;
    role?: string;
  };
}

export interface ForgotPasswordPayload {
  email?: string;
  mobile_number?: string;
}

export interface ResetPasswordPayload {
  reset_token: string;
  new_password: string;
}

export interface MessageResponse {
  message?: string;
  detail?: string;
}

/**
 * Token storage utilities
 */
export function getAuthToken(): string | null {
  try {
    return localStorage.getItem('access_token');
  } catch {
    return null;
  }
}

export function setAuthToken(token: string): void {
  try {
    localStorage.setItem('access_token', token);
  } catch (err) {
    console.error('Failed to save access token', err);
  }
}

export function clearAuthToken(): void {
  try {
    localStorage.removeItem('access_token');
  } catch (err) {
    console.error('Failed to clear access token', err);
  }
}

/**
 * Core API request handler with automatic Bearer token injection
 */
export async function apiRequest<T = any>(
  endpoint: string,
  method = 'GET',
  data: any = null,
  requiresAuth = false
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (requiresAuth) {
    const token = getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  // Ensure endpoint starts with slash
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = `${API_BASE_URL}${cleanEndpoint}`;

  try {
    const response = await fetch(url, {
      method,
      headers,
      body: data ? JSON.stringify(data) : null,
    });

    // Handle 204 No Content
    if (response.status === 204) {
      return {} as T;
    }

    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
      let errorMessage = `Request failed with status ${response.status}`;

      if (typeof result.detail === 'string') {
        errorMessage = result.detail;
      } else if (Array.isArray(result.detail)) {
        // FastAPI / Pydantic validation error array
        errorMessage = result.detail
          .map((d: any) => {
            const field = Array.isArray(d.loc) ? d.loc[d.loc.length - 1] : '';
            return field && field !== 'body' ? `${field}: ${d.msg}` : d.msg || JSON.stringify(d);
          })
          .join(', ');
      } else if (result.message) {
        errorMessage = result.message;
      }

      // Handle 401 Unauthorized
      if (response.status === 401) {
        clearAuthToken();
      }

      throw new Error(errorMessage);
    }

    return result as T;
  } catch (err: any) {
    // Check if network failed or server is unreachable
    if (
      err.name === 'TypeError' &&
      (err.message.includes('fetch') || err.message.includes('NetworkError') || err.message.includes('Failed to fetch'))
    ) {
      throw new Error('BACKEND_UNREACHABLE');
    }
    throw err;
  }
}

/**
 * Authentication API Service
 */
export const authApi = {
  /**
   * User Registration: POST /api/v1/auth/register
   * Payload: { full_name, mobile_number, email, password }
   */
  async register(data: RegisterPayload) {
    return apiRequest('/auth/register', 'POST', data);
  },

  /**
   * User Login: POST /api/v1/auth/login
   * Payload: { username, password }
   */
  async login(data: LoginPayload): Promise<LoginResponse> {
    return apiRequest<LoginResponse>('/auth/login', 'POST', data);
  },

  /**
   * Forgot Password Request: POST /api/v1/auth/forgot-password
   * Payload: { email } or { mobile_number }
   */
  async forgotPassword(data: ForgotPasswordPayload): Promise<MessageResponse> {
    return apiRequest<MessageResponse>('/auth/forgot-password', 'POST', data);
  },

  /**
   * Reset Password: POST /api/v1/auth/reset-password
   * Payload: { reset_token, new_password }
   */
  async resetPassword(data: ResetPasswordPayload): Promise<MessageResponse> {
    return apiRequest<MessageResponse>('/auth/reset-password', 'POST', data);
  },

  /**
   * Fetch current authenticated user profile: GET /api/v1/auth/me
   */
  async getProfile() {
    return apiRequest('/auth/me', 'GET', null, true);
  },
};

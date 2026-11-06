'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, Role } from '@/lib/types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAdmin: boolean;
  login: (emailOrUsername: string, password: string, rememberMe?: boolean) => Promise<{ success: boolean; error?: string; user?: User }>;
  register: (data: {
    name: string;
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
    avatar?: string;
  }) => Promise<{ success: boolean; error?: string; user?: User }>;
  logout: () => Promise<void>;
  switchRole: (role: Role) => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/me', { cache: 'no-store' });
      const data = await res.json();
      if (data.user) {
        setUser(data.user);
        if (typeof window !== 'undefined') {
          localStorage.setItem('sonora_logged_in', 'true');
        }
      } else {
        setUser(null);
        if (typeof window !== 'undefined') {
          localStorage.removeItem('sonora_logged_in');
        }
      }
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const login = async (emailOrUsername: string, password: string, rememberMe?: boolean) => {
    try {
      const cleanIdentifier = emailOrUsername.trim();
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: cleanIdentifier,
          username: cleanIdentifier,
          identifier: cleanIdentifier,
          password,
          rememberMe: Boolean(rememberMe)
        })
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Login failed' };
      }
      setUser(data.user);
      if (typeof window !== 'undefined') {
        localStorage.setItem('sonora_logged_in', 'true');
        localStorage.setItem('sonora_user_name', data.user.name || '');
        if (rememberMe) {
          localStorage.setItem('sonora_saved_identifier', cleanIdentifier);
        } else {
          localStorage.removeItem('sonora_saved_identifier');
        }
      }
      return { success: true, user: data.user };
    } catch (err: any) {
      return { success: false, error: err.message || 'Network error' };
    }
  };

  const register = async (formData: {
    name: string;
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
    avatar?: string;
  }) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          username: formData.username.trim().toLowerCase().replace(/^@+/, ''),
          email: formData.email.trim().toLowerCase()
        })
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Registration failed' };
      }
      setUser(data.user);
      if (typeof window !== 'undefined') {
        localStorage.setItem('sonora_logged_in', 'true');
        localStorage.setItem('sonora_user_name', data.user.name || '');
      }
      return { success: true, user: data.user };
    } catch (err: any) {
      return { success: false, error: err.message || 'Network error' };
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch {
      // ignore
    } finally {
      setUser(null);
      if (typeof window !== 'undefined') {
        localStorage.removeItem('sonora_logged_in');
        localStorage.removeItem('sonora_user_name');
        window.location.href = '/auth/login';
      }
    }
  };

  const switchRole = async (targetRole: Role) => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/auth/switch-role', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetRole })
      });
      const data = await res.json();
      if (data.user) {
        setUser(data.user);
      }
    } catch (err) {
      console.error('Failed to switch role', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAdmin: user?.role === 'admin',
        login,
        register,
        logout,
        switchRole,
        refreshUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}

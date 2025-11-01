import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { User, AuthResponse } from '@shared/api';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, username: string, display_name: string) => Promise<void>;
  logout: () => void;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // FIXED: Initialize auth state from Supabase session
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { supabase } = await import('@/services/supabaseClient');
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          // Update user status to online
          await supabase
            .from('profiles')
            .update({ status: 'online' })
            .eq('id', session.user.id);

          setUser({
            id: session.user.id,
            email: session.user.email!,
            username: session.user.user_metadata?.username || session.user.email!.split('@')[0],
            display_name: session.user.user_metadata?.display_name || session.user.email!.split('@')[0],
            avatar_url: session.user.user_metadata?.avatar_url,
            status: 'online',
            created_at: session.user.created_at
          });
        }
      } catch (error) {
        console.error('Failed to initialize auth:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      // FIXED: Use Supabase Auth instead of custom API
      const { supabase } = await import('@/services/supabaseClient');
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) throw error;
      if (!data.user) throw new Error('Login failed');
      
      // Update user status to online
      await supabase
        .from('profiles')
        .update({ status: 'online' })
        .eq('id', data.user.id);
      
      setUser({
        id: data.user.id,
        email: data.user.email!,
        username: data.user.user_metadata?.username || email.split('@')[0],
        display_name: data.user.user_metadata?.display_name || email.split('@')[0],
        avatar_url: data.user.user_metadata?.avatar_url,
        status: 'online',
        created_at: data.user.created_at
      });
    } catch (error) {
      throw error;
    }
  }, []);

  const register = useCallback(async (
    email: string,
    password: string,
    username: string,
    display_name: string
  ) => {
    try {
      const { supabase } = await import('@/services/supabaseClient');
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { username, display_name }
        }
      });
      
      if (error) throw error;
      if (!data.user) throw new Error('Registration failed');
      
      setUser({
        id: data.user.id,
        email: data.user.email!,
        username,
        display_name,
        avatar_url: null,
        status: 'online',
        created_at: data.user.created_at
      });
    } catch (error) {
      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    // FIXED: Use Supabase Auth logout
    const { supabase } = await import('@/services/supabaseClient');
    if (user) {
      // Update user status to offline
      await supabase
        .from('profiles')
        .update({ status: 'offline' })
        .eq('id', user.id);
    }
    await supabase.auth.signOut();
    setUser(null);
  }, [user]);

  const updateUser = useCallback((updatedUser: User) => {
    setUser(updatedUser);
  }, []);

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

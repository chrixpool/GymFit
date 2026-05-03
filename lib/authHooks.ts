import { supabase } from './supabase';
import type { User } from '@supabase/supabase-js';
import { useEffect, useState, useCallback } from 'react';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

// Storage key for session persistence
const SESSION_STORAGE_KEY = 'gym_tunisia_session';

/**
 * Safe wrapper for Supabase auth operations with error handling
 */
export const safeAuthOperation = async <T,>(
  operation: () => Promise<{ data: T | null; error: unknown }>,
  fallback?: T | null
): Promise<T | null> => {
  try {
    const { data, error } = await operation();
    if (error) {
      console.warn('Supabase auth operation failed:', error.message);
      return fallback ?? null;
    }
    return data;
  } catch (caughtError) {
    console.error('Unexpected auth error:', caughtError instanceof Error ? caughtError.message : 'Unknown error');
    return fallback ?? null;
  }
};

/**
 * Get current user with safe error handling
 */
export const getCurrentUserSafe = async (): Promise<User | null> => {
  return safeAuthOperation(async () => {
    return await supabase.auth.getUser();
  });
};

/**
 * Sign out with safe error handling
 */
export const signOutSafe = async (): Promise<boolean> => {
  const result = await safeAuthOperation(async () => {
    return await supabase.auth.signOut();
  }, undefined);
  return result !== null || true; // Sign out always succeeds even if no session
};

/**
 * Custom hook for managing auth state with session persistence
 */
export interface UseAuthState {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  refreshSession: () => Promise<void>;
  signOut: () => Promise<void>;
}

export const useAuthState = (): UseAuthState => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const loadSession = useCallback(async () => {
    try {
      // Try to get session from Supabase first (handles auto-refresh)
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        setUser(session.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.warn('Failed to load session:', error instanceof Error ? error.message : 'Unknown error');
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshSession = useCallback(async () => {
    try {
      const { data: { session }, error } = await supabase.auth.refreshSession();
      if (error) {
        console.warn('Session refresh failed:', error.message);
        setUser(null);
      } else if (session?.user) {
        setUser(session.user);
      }
    } catch (error) {
      console.warn('Unexpected error refreshing session:', error instanceof Error ? error.message : 'Unknown error');
      setUser(null);
    }
  }, []);

  const signOut = useCallback(async () => {
    await signOutSafe();
    setUser(null);
  }, []);

  useEffect(() => {
    loadSession();

    // Subscribe to auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event);
      
      switch (event) {
        case 'SIGNED_IN':
          if (session?.user) {
            setUser(session.user);
          }
          break;
        case 'SIGNED_OUT':
          setUser(null);
          break;
        case 'TOKEN_REFRESHED':
          if (session?.user) {
            setUser(session.user);
          }
          break;
        case 'USER_UPDATED':
          if (session?.user) {
            setUser(session.user);
          }
          break;
        default:
          break;
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [loadSession]);

  return {
    user,
    loading,
    isAuthenticated: !!user,
    refreshSession,
    signOut,
  };
};

/**
 * Higher-order component wrapper for protected routes
 */
export const withAuthProtection = (WrappedComponent: React.ComponentType<{ user: User }>) => {
  return function ProtectedRoute(props: Record<string, unknown>) {
    const { user, loading, isAuthenticated } = useAuthState();

    if (loading) {
      return null; // Let the layout handle loading state
    }

    if (!isAuthenticated || !user) {
      return null; // Let the layout handle redirect
    }

    return <WrappedComponent {...props} user={user} />;
  };
};

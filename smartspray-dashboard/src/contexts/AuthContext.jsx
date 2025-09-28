import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/auth';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const queryClient = useQueryClient();

  // Fetch current user on mount
  const { refetch: fetchUser } = useQuery(['currentUser'], authService.getCurrentUser, {
    enabled: false,
    retry: false,
    onSuccess: (data) => {
      setUser(data.data);
      setLoading(false);
    },
    onError: () => {
      setUser(null);
      setLoading(false);
    },
  });

  // Login mutation
  const loginMutation = useMutation(authService.login, {
    onSuccess: (data) => {
      localStorage.setItem('authToken', data.token);
      setUser(data.data);
      queryClient.invalidateQueries(['currentUser']);
    },
  });

  // Register mutation
  const registerMutation = useMutation(authService.register, {
    onSuccess: (data) => {
      localStorage.setItem('authToken', data.token);
      setUser(data.data);
    },
  });

  // Update user mutation
  const updateUserMutation = useMutation(authService.updateUser, {
    onSuccess: (data) => {
      setUser(data.data);
      queryClient.invalidateQueries(['currentUser']);
    },
  });

  // Update password mutation
  const updatePasswordMutation = useMutation(authService.updatePassword, {
    onSuccess: () => {
      queryClient.invalidateQueries(['currentUser']);
    },
  });

  // Logout function
  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.warn('Logout error (ignored):', error);
    } finally {
      localStorage.removeItem('authToken');
      setUser(null);
      queryClient.clear();
      window.location.href = '/login';
    }
  };

  // Check if user is authenticated on app load
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      fetchUser().finally(() => setLoading(false)); // ✅ always end loading
    } else {
      setLoading(false); // ✅ no token → no need to wait
    }
  }, [fetchUser]);

  const value = {
    user,
    loading, // ✅ only our controlled loading, no userLoading merge
    isAuthenticated: !!user,
    login: loginMutation.mutateAsync,
    loginLoading: loginMutation.isLoading,
    register: registerMutation.mutateAsync,
    registerLoading: registerMutation.isLoading,
    updateUser: updateUserMutation.mutateAsync,
    updateUserLoading: updateUserMutation.isLoading,
    updatePassword: updatePasswordMutation.mutateAsync,
    updatePasswordLoading: updatePasswordMutation.isLoading,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

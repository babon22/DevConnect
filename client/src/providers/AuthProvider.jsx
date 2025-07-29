import React, { createContext, useState, useEffect } from 'react';
import apiClient from '../lib/apiClient';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
        const userItem = localStorage.getItem('user');
        return userItem ? JSON.parse(userItem) : null;
    } catch (e) {
        return null;
    }
  });
  const queryClient = useQueryClient();

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  const login = async (email, password) => {
    try {
      const { data } = await apiClient.post('/auth/login', { email, password });
      setUser(data);
      toast.success("Login successful!");
      return data;
    } catch (error) {
      const message = error.response?.data?.message || "Login failed";
      toast.error(message);
      throw new Error(message);
    }
  };

  const signup = async (name, email, password) => {
    try {
      const { data } = await apiClient.post('/auth/signup', { name, email, password });
      setUser(data);
      toast.success("Signup successful! Welcome.");
      return data;
    } catch (error) {
      const message = error.response?.data?.message || "Signup failed";
      toast.error(message);
      throw new Error(message);
    }
  };

  const logout = async () => {
    try {
      await apiClient.post('/auth/logout');
    } catch (error) {
       console.error("Logout API call failed, clearing client-side state anyway.");
    } finally {
      setUser(null);
      queryClient.clear(); // Clear all react-query cache on logout
      toast.info("You have been logged out.");
    }
  };
  
  const value = { user, setUser, isAuthenticated: !!user, login, signup, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
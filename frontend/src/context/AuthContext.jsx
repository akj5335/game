import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { supabase } from '../lib/supabase';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async (userId) => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      return { data, error };
    };

    const checkUser = async () => {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        setSession(session);
        const { data: profile } = await fetchProfile(session.user.id);
        setUser({ ...session.user, ...profile });
        axios.defaults.headers.common['Authorization'] = `Bearer ${session.access_token}`;
      } else {
        const savedGuest = localStorage.getItem('neonplay_guest');
        if (savedGuest) {
          setUser(JSON.parse(savedGuest));
        }
      }
      setLoading(false);
    };

    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      if (session) {
        const { data: profile } = await fetchProfile(session.user.id);
        setUser({ ...session.user, ...profile });
        axios.defaults.headers.common['Authorization'] = `Bearer ${session.access_token}`;
        localStorage.removeItem('neonplay_guest');
      } else {
        setUser(null);
        delete axios.defaults.headers.common['Authorization'];
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  };

  const register = async ({ email, password, name }) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name }
      }
    });
    if (error) throw error;
    return data;
  };

  const logout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('neonplay_guest');
    setUser(null);
    setSession(null);
  };

  return (
    <AuthContext.Provider value={{ user, session, login, register, logout, loading, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

import { useState, useEffect } from 'react';
import { supabase } from '@/services/supabaseClient';
import { useAuth } from '@/contexts/AuthContext';

export interface Profile {
  id: string;
  username: string;
  bio: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export function useProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }

    fetchProfile();
  }, [user]);

  async function fetchProfile() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user!.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      
      if (!data) {
        // Create default profile
        const { data: newProfile, error: insertError } = await supabase
          .from('profiles')
          .insert({ id: user!.id, username: user!.username })
          .select()
          .single();
        
        if (insertError) throw insertError;
        setProfile(newProfile);
      } else {
        setProfile(data);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function updateProfile(updates: Partial<Profile>) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user!.id)
        .select()
        .single();

      if (error) throw error;
      setProfile(data);
      return data;
    } catch (err: any) {
      if (err.code === '23505') {
        throw new Error('This username is already taken');
      }
      throw err;
    }
  }

  return { profile, loading, error, updateProfile, refetch: fetchProfile };
}

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { serverService } from '@/services/serverService';
import { Server } from '@shared/api';

export function useServers() {
  const { user } = useAuth();
  const [servers, setServers] = useState<Server[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    const fetchServers = async () => {
      try {
        setIsLoading(true);
        const data = await serverService.getServers(user.id);
        setServers(data);
        setError(null);
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : String(err);
        console.error('useServers error:', err);
        setError(errorMsg);
      } finally {
        setIsLoading(false);
      }
    };

    fetchServers();
  }, [user]);

  const createServer = async (name: string, icon_url?: string) => {
    if (!user) throw new Error('User not authenticated');
    try {
      const newServer = await serverService.createServer(user.id, name, icon_url);
      setServers([...servers, newServer]);
      return newServer;
    } catch (err) {
      throw err;
    }
  };

  const updateServer = async (serverId: string, updates: Partial<Server>) => {
    try {
      const updated = await serverService.updateServer(serverId, updates);
      setServers(servers.map(s => s.id === serverId ? updated : s));
      return updated;
    } catch (err) {
      throw err;
    }
  };

  const deleteServer = async (serverId: string) => {
    try {
      await serverService.deleteServer(serverId);
      setServers(servers.filter(s => s.id !== serverId));
    } catch (err) {
      throw err;
    }
  };

  return { servers, isLoading, error, createServer, updateServer, deleteServer };
}

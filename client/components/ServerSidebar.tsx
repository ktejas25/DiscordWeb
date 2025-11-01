import React, { useState } from 'react';
import { useServers } from '@/hooks/useServers';
import { Plus, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface ServerSidebarProps {
  selectedServerId: string | null;
  onServerSelect: (serverId: string) => void;
}

export function ServerSidebar({ selectedServerId, onServerSelect }: ServerSidebarProps) {
  const { servers, isLoading, createServer } = useServers();
  const { user } = useAuth();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [serverName, setServerName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreateServer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!serverName.trim()) {
      toast.error('Server name is required');
      return;
    }

    setIsSubmitting(true);
    try {
      const newServer = await createServer(serverName);
      setServerName('');
      setIsCreateOpen(false);
      onServerSelect(newServer.id);
      toast.success('Server created successfully');
    } catch (error: any) {
      // Show detailed error message
      const errorMsg = error?.message || 'Failed to create server';
      console.error('Create server error:', error);
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-20 bg-discord-dark border-r border-discord-darker flex flex-col items-center py-4 gap-2">
      {/* Server Icons */}
      {isLoading ? (
        <div className="text-center text-discord-muted">
          <div className="w-12 h-12 rounded-full border-2 border-discord-darker border-t-primary animate-spin"></div>
        </div>
      ) : (
        <>
          {servers.map((server) => (
            <button
              key={server.id}
              onClick={() => onServerSelect(server.id)}
              className={`w-12 h-12 rounded-full flex items-center justify-center font-bold transition-all ${
                selectedServerId === server.id
                  ? 'bg-primary text-white'
                  : 'bg-discord-darker text-discord-muted hover:bg-primary/70 hover:text-white'
              }`}
              title={server.name}
            >
              {server.icon_url ? (
                <img src={server.icon_url} alt={server.name} className="w-full h-full rounded-full" />
              ) : (
                server.name.charAt(0).toUpperCase()
              )}
            </button>
          ))}

          {/* Create Server Button */}
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <button
                className="w-12 h-12 rounded-full flex items-center justify-center bg-discord-darker text-primary hover:bg-primary hover:text-white transition-all"
                title="Create Server"
              >
                <Plus className="w-6 h-6" />
              </button>
            </DialogTrigger>
            <DialogContent className="bg-discord-darker border-discord-darker text-white">
              <DialogHeader>
                <DialogTitle>Create a new server</DialogTitle>
                <DialogDescription>Enter a name for your new server</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateServer} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Server Name</label>
                  <Input
                    value={serverName}
                    onChange={(e) => setServerName(e.target.value)}
                    placeholder="My Awesome Server"
                    disabled={isSubmitting}
                    className="bg-discord-dark border-discord-dark text-white placeholder:text-discord-muted"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-primary hover:bg-primary/90"
                >
                  {isSubmitting ? 'Creating...' : 'Create Server'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  );
}

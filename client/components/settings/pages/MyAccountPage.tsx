import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useProfile';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

export function MyAccountPage() {
  const { user } = useAuth();
  const { profile } = useProfile();

  if (!user) return null;

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">My Account</h2>
        <p className="text-discord-muted">View your account information</p>
      </div>

      <div className="space-y-4">
        <div>
          <Label className="text-discord-muted">Email</Label>
          <Input value={user.email} disabled className="bg-discord-darker border-discord-dark text-white" />
        </div>

        <div>
          <Label className="text-discord-muted">User ID</Label>
          <Input value={user.id} disabled className="bg-discord-darker border-discord-dark text-white" />
        </div>

        <div>
          <Label className="text-discord-muted">Account Created</Label>
          <Input
            value={new Date(user.created_at).toLocaleDateString()}
            disabled
            className="bg-discord-darker border-discord-dark text-white"
          />
        </div>

        <div>
          <Label className="text-discord-muted">Username</Label>
          <Input
            value={profile?.username || user.username}
            disabled
            className="bg-discord-darker border-discord-dark text-white"
          />
        </div>
      </div>


    </div>
  );
}

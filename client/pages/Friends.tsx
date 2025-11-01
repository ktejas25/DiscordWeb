import React from 'react';
import { FriendsList } from '@/components/FriendsList';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function Friends() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-discord-dark p-8">
      <button
        onClick={() => navigate('/app/channels')}
        className="flex items-center gap-2 text-discord-muted hover:text-white mb-8 transition"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Channels
      </button>
      <FriendsList />
    </div>
  );
}

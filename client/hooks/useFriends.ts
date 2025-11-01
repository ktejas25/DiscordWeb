import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { friendService } from '@/services/friendService';

export function useFriends(status: 'accepted' | 'pending' | 'blocked' = 'accepted') {
  const { user } = useAuth();
  const [friends, setFriends] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    const fetchFriends = async () => {
      try {
        setIsLoading(true);
        const data = await friendService.getFriends(user.id, status);
        setFriends(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch friends');
      } finally {
        setIsLoading(false);
      }
    };

    fetchFriends();
  }, [user, status]);

  const sendFriendRequest = async (username: string, message?: string) => {
    if (!user) throw new Error('User not authenticated');
    try {
      const request = await friendService.sendFriendRequest(user.id, username, message);
      return request;
    } catch (err) {
      throw err;
    }
  };

  const acceptFriendRequest = async (friendshipId: string) => {
    try {
      await friendService.acceptFriendRequest(friendshipId);
      setFriends(friends.filter(f => f.id !== friendshipId));
    } catch (err) {
      throw err;
    }
  };

  const rejectFriendRequest = async (friendshipId: string) => {
    try {
      await friendService.rejectFriendRequest(friendshipId);
      setFriends(friends.filter(f => f.id !== friendshipId));
    } catch (err) {
      throw err;
    }
  };

  const removeFriend = async (friendId: string) => {
    if (!user) throw new Error('User not authenticated');
    try {
      await friendService.removeFriend(user.id, friendId);
      setFriends(friends.filter(f => f.friend_id !== friendId));
    } catch (err) {
      throw err;
    }
  };

  const blockUser = async (userId: string) => {
    if (!user) throw new Error('User not authenticated');
    try {
      await friendService.blockUser(user.id, userId);
    } catch (err) {
      throw err;
    }
  };

  const unblockUser = async (userId: string) => {
    if (!user) throw new Error('User not authenticated');
    try {
      await friendService.unblockUser(user.id, userId);
      setFriends(friends.filter(f => f.friend_id !== userId));
    } catch (err) {
      throw err;
    }
  };

  return {
    friends,
    isLoading,
    error,
    sendFriendRequest,
    acceptFriendRequest,
    rejectFriendRequest,
    removeFriend,
    blockUser,
    unblockUser
  };
}

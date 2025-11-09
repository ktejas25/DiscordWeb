import React, { useState } from 'react';
import { useFriends } from '@/hooks/useFriends';
import { Plus, User, Clock, Ban, UserCheck } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

interface FriendsListProps {
  onStartDM?: (userId: string) => void;
}

export function FriendsList({ onStartDM }: FriendsListProps) {
  const acceptedFriends = useFriends('accepted');
  const pendingRequests = useFriends('pending');
  const blockedUsers = useFriends('blocked');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [searchUsername, setSearchUsername] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddFriend = async () => {
    if (!searchUsername.trim()) {
      toast.error('Please enter a username');
      return;
    }

    setIsSubmitting(true);
    try {
      await acceptedFriends.sendFriendRequest(searchUsername);
      setSearchUsername('');
      setIsAddOpen(false);
      toast.success('Friend request sent!');
    } catch (error: any) {
      const message = error?.message || 'Failed to send friend request';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-discord-darker rounded-lg border border-discord-darker p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-white">Friends</h1>
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <button className="flex items-center gap-2 px-4 py-2 rounded bg-primary hover:bg-primary/90 text-white transition">
                <Plus className="w-4 h-4" />
                Add Friend
              </button>
            </DialogTrigger>
            <DialogContent className="bg-discord-darker border-discord-darker text-white">
              <DialogHeader>
                <DialogTitle>Add Friend</DialogTitle>
                <DialogDescription>Send a friend request by entering their username</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Username</label>
                  <Input
                    value={searchUsername}
                    onChange={(e) => setSearchUsername(e.target.value)}
                    placeholder="Search username..."
                    disabled={isSubmitting}
                    className="bg-discord-dark border-discord-dark text-white placeholder:text-discord-muted"
                  />
                </div>
                <Button
                  onClick={handleAddFriend}
                  disabled={isSubmitting}
                  className="w-full bg-primary hover:bg-primary/90"
                >
                  {isSubmitting ? 'Sending...' : 'Send Request'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-discord-dark">
            <TabsTrigger value="all">
              <UserCheck className="w-4 h-4 mr-2" />
              All ({acceptedFriends.friends.length})
            </TabsTrigger>
            <TabsTrigger value="pending">
              <Clock className="w-4 h-4 mr-2" />
              Pending ({pendingRequests.friends.length})
            </TabsTrigger>
            <TabsTrigger value="blocked">
              <Ban className="w-4 h-4 mr-2" />
              Blocked ({blockedUsers.friends.length})
            </TabsTrigger>
          </TabsList>

          {/* All Friends */}
          <TabsContent value="all" className="space-y-2 mt-4">
            {acceptedFriends.isLoading ? (
              <div className="text-center text-discord-muted py-8">Loading...</div>
            ) : acceptedFriends.friends.length === 0 ? (
              <div className="text-center text-discord-muted py-8">No friends yet</div>
            ) : (
              acceptedFriends.friends.map((friend) => (
                <div
                  key={friend.id}
                  className="flex items-center justify-between p-3 rounded hover:bg-discord-dark/50 transition"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs">
                      {friend.friend_user?.username?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div>
                      <p className="text-white font-medium">{friend.friend_user?.display_name}</p>
                      <p className="text-xs text-discord-muted">@{friend.friend_user?.username}</p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => onStartDM?.(friend.friend_id)}
                    className="bg-primary hover:bg-primary/90"
                  >
                    Message
                  </Button>
                </div>
              ))
            )}
          </TabsContent>

          {/* Pending Requests */}
          <TabsContent value="pending" className="space-y-2 mt-4">
            {pendingRequests.isLoading ? (
              <div className="text-center text-discord-muted py-8">Loading...</div>
            ) : pendingRequests.friends.length === 0 ? (
              <div className="text-center text-discord-muted py-8">No pending requests</div>
            ) : (
              pendingRequests.friends.map((request) => (
                <div
                  key={request.id}
                  className="flex items-center justify-between p-3 rounded hover:bg-discord-dark/50 transition"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs">
                      {request.requester?.username?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div>
                      <p className="text-white font-medium">{request.requester?.display_name}</p>
                      <p className="text-xs text-discord-muted">@{request.requester?.username}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => pendingRequests.acceptFriendRequest(request.id)}
                      className="bg-primary hover:bg-primary/90"
                    >
                      Accept
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => pendingRequests.rejectFriendRequest(request.id)}
                      className="text-discord-muted hover:text-white"
                    >
                      Reject
                    </Button>
                  </div>
                </div>
              ))
            )}
          </TabsContent>

          {/* Blocked Users */}
          <TabsContent value="blocked" className="space-y-2 mt-4">
            {blockedUsers.isLoading ? (
              <div className="text-center text-discord-muted py-8">Loading...</div>
            ) : blockedUsers.friends.length === 0 ? (
              <div className="text-center text-discord-muted py-8">No blocked users</div>
            ) : (
              blockedUsers.friends.map((blocked) => (
                <div
                  key={blocked.id}
                  className="flex items-center justify-between p-3 rounded hover:bg-discord-dark/50 transition"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-discord-dark flex items-center justify-center text-discord-muted font-bold text-xs">
                      {blocked.friend_user?.username?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div>
                      <p className="text-white font-medium">{blocked.friend_user?.display_name}</p>
                      <p className="text-xs text-discord-muted">@{blocked.friend_user?.username}</p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => blockedUsers.unblockUser(blocked.friend_id)}
                    className="text-discord-muted hover:text-white"
                  >
                    Unblock
                  </Button>
                </div>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

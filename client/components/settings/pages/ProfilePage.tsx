import React, { useState, useRef } from 'react';
import { useProfile } from '@/hooks/useProfile';
import { uploadAvatar } from '@/services/storageService';
import { useAuth } from '@/contexts/AuthContext';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Upload } from 'lucide-react';

export function ProfilePage() {
  const { user, updateUser } = useAuth();
  const { profile, loading, updateProfile } = useProfile();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [imageKey, setImageKey] = useState(Date.now());
  const [imageError, setImageError] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [usernameError, setUsernameError] = useState('');

  React.useEffect(() => {
    if (profile) {
      setUsername(profile.username || '');
      setBio(profile.bio || '');
      setAvatarUrl(profile.avatar_url || '');
      setImageKey(Date.now());
      setImageError(false);
    }
  }, [profile]);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    if (file.size > 5 * 1024 * 1024) {
      toast({ title: 'Error', description: 'File size must be less than 5MB', variant: 'destructive' });
      return;
    }

    if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) {
      toast({ title: 'Error', description: 'Only PNG, JPG, and WebP are allowed', variant: 'destructive' });
      return;
    }

    try {
      setUploading(true);
      const url = await uploadAvatar(user.id, file);
      await updateProfile({ avatar_url: url });
      setAvatarUrl(url);
      setImageKey(Date.now());
      if (user) {
        updateUser({ ...user, avatar_url: url });
      }
      toast({ title: 'Success', description: 'Avatar uploaded' });
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!username.trim()) {
      setUsernameError('Username is required');
      return;
    }

    if (username.length < 3 || username.length > 32) {
      setUsernameError('Username must be 3-32 characters');
      return;
    }

    if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
      setUsernameError('Username can only contain letters, numbers, _ and -');
      return;
    }

    try {
      setSaving(true);
      setUsernameError('');
      await updateProfile({ username, bio, avatar_url: avatarUrl });
      if (user) {
        updateUser({ ...user, username, avatar_url: avatarUrl });
      }
      toast({ title: 'Success', description: 'Profile updated' });
    } catch (error: any) {
      if (error.message.includes('taken')) {
        setUsernameError('This username is already taken');
      } else {
        toast({ title: 'Error', description: error.message, variant: 'destructive' });
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-white">Loading profile...</div>;
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Profile</h2>
        <p className="text-discord-muted">Customize your profile</p>
      </div>

      <div className="space-y-4">
        <div>
          <Label className="text-white">Avatar</Label>
          <div className="flex items-center gap-4 mt-2">
            <div className="w-20 h-20 rounded-full bg-discord-darker flex items-center justify-center overflow-hidden">
              {avatarUrl && !imageError ? (
                <img 
                  key={imageKey} 
                  src={`${avatarUrl}?t=${imageKey}`} 
                  alt="Avatar" 
                  className="w-full h-full object-cover"
                  onError={() => setImageError(true)}
                  onLoad={() => setImageError(false)}
                />
              ) : (
                <span className="text-2xl text-white">{username.charAt(0).toUpperCase()}</span>
              )}
            </div>
            <Button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              variant="outline"
              className="bg-discord-darker border-discord-dark text-white hover:bg-discord-dark"
            >
              <Upload className="w-4 h-4 mr-2" />
              {uploading ? 'Uploading...' : 'Upload'}
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={handleAvatarUpload}
              className="hidden"
            />
          </div>
          <p className="text-xs text-discord-muted mt-2">PNG, JPG, or WebP. Max 5MB.</p>
        </div>

        <div>
          <Label className="text-white">Username</Label>
          <Input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="bg-discord-darker border-discord-dark text-white mt-2"
            placeholder="Enter username"
          />
          {usernameError && <p className="text-red-400 text-sm mt-1">{usernameError}</p>}
        </div>

        <div>
          <Label className="text-white">Bio</Label>
          <Textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            maxLength={300}
            className="bg-discord-darker border-discord-dark text-white mt-2 resize-none"
            placeholder="Tell us about yourself"
            rows={4}
          />
          <p className="text-xs text-discord-muted mt-1">{bio.length}/300</p>
        </div>
      </div>

      <div className="flex gap-2">
        <Button onClick={handleSave} disabled={saving} className="bg-primary hover:bg-primary/90">
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
        <Button
          onClick={() => {
            setUsername(profile?.username || '');
            setBio(profile?.bio || '');
            setAvatarUrl(profile?.avatar_url || '');
            setUsernameError('');
          }}
          variant="outline"
          className="bg-discord-darker border-discord-dark text-white hover:bg-discord-dark"
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}

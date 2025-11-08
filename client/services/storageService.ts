import { supabase } from './supabaseClient';

export async function uploadAvatar(userId: string, file: File): Promise<string> {
  const ext = file.name.split('.').pop();
  const timestamp = Date.now();
  const path = `${userId}/${timestamp}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(path, file, { upsert: true });

  if (uploadError) throw uploadError;

  const { data } = supabase.storage.from('avatars').getPublicUrl(path);
  return data.publicUrl;
}

export async function deleteAvatar(url: string): Promise<void> {
  const path = url.split('/avatars/')[1];
  if (!path) return;

  const { error } = await supabase.storage.from('avatars').remove([path]);
  if (error) throw error;
}

export async function uploadMessageAttachment(userId: string, file: File): Promise<string> {
  const ext = file.name.split('.').pop();
  const timestamp = Date.now();
  const path = `${userId}/${timestamp}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from('message-attachments')
    .upload(path, file);

  if (uploadError) throw uploadError;

  const { data } = supabase.storage.from('message-attachments').getPublicUrl(path);
  return data.publicUrl;
}

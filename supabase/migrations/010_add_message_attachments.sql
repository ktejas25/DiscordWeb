-- Add attachments column to messages table
ALTER TABLE api.messages 
ADD COLUMN IF NOT EXISTS attachments JSONB DEFAULT '[]'::jsonb;

-- Create message_attachments storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('message-attachments', 'message-attachments', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for message attachments
CREATE POLICY "Message attachments are publicly readable"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'message-attachments');

CREATE POLICY "Users can upload message attachments"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'message-attachments' AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can delete own message attachments"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'message-attachments' AND auth.uid() IS NOT NULL);

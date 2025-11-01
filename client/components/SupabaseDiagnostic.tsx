import React, { useEffect, useState } from 'react';
import { supabase } from '@/services/supabaseClient';
import { Card } from '@/components/ui/card';
import { AlertCircle, CheckCircle } from 'lucide-react';

export function SupabaseDiagnostic() {
  const [status, setStatus] = useState<{
    connected: boolean;
    tables: string[];
    error?: string;
    schema?: string;
  } | null>(null);

  useEffect(() => {
    const checkSupabase = async () => {
      try {
        const { data, error } = await supabase.from('servers').select('*', { count: 'exact' });

        if (error) {
          if (error.message.includes('does not exist')) {
            setStatus({
              connected: true,
              tables: [],
              schema: 'api',
              error: 'Supabase tables do not exist in api schema. Please create the database schema first.'
            });
          } else if (error.message.includes('permission')) {
            setStatus({
              connected: true,
              tables: [],
              schema: 'api',
              error: 'Permission denied. Check your Supabase RLS policies.'
            });
          } else {
            setStatus({
              connected: false,
              tables: [],
              schema: 'api',
              error: error.message
            });
          }
        } else {
          setStatus({
            connected: true,
            tables: ['servers'],
            schema: 'api',
            error: undefined
          });
        }
      } catch (err: any) {
        setStatus({
          connected: false,
          tables: [],
          schema: 'api',
          error: err.message || 'Unknown error'
        });
      }
    };

    checkSupabase();
  }, []);

  if (!status) return null;

  return (
    <Card className="fixed bottom-4 right-4 w-96 bg-discord-darker border-discord-darker text-white p-4">
      <div className="flex items-start gap-3">
        {status.connected ? (
          <CheckCircle className="w-5 h-5 text-green-500 mt-1" />
        ) : (
          <AlertCircle className="w-5 h-5 text-red-500 mt-1" />
        )}
        <div className="flex-1">
          <h3 className="font-semibold mb-1">
            Supabase Status
            {status.schema && <span className="text-xs text-discord-muted ml-2">({status.schema} schema)</span>}
          </h3>
          {status.error ? (
            <>
              <p className="text-sm text-red-300 mb-2">{status.error}</p>
              <p className="text-xs text-discord-muted">
                Ensure all required tables exist in the {status.schema} schema:
                servers, server_members, channels, channel_members, messages, dm_conversations, etc.
              </p>
            </>
          ) : (
            <p className="text-sm text-green-300">Connected successfully to {status.schema} schema</p>
          )}
        </div>
      </div>
    </Card>
  );
}

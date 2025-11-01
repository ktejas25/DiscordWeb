import { Request, Response } from 'express';
import { createClient } from '@supabase/supabase-js';

const getSupabaseAdmin = () => {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY;
  
  if (!url || !key) {
    console.error('Missing Supabase credentials:', { hasUrl: !!url, hasKey: !!key });
    throw new Error('Missing Supabase credentials');
  }
  
  console.log('Creating Supabase admin client with schema: api');
  return createClient(url, key, {
    db: { schema: 'api' },
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
};

export async function handleSendInvitation(req: Request, res: Response) {
  try {
    const { channelId } = req.params;
    const { inviteeId } = req.body;
    const inviterId = (req as any).user.id;

    console.log('Send invitation:', { channelId, inviterId, inviteeId });

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from('channel_invitations')
      .insert({ channel_id: channelId, inviter_id: inviterId, invitee_id: inviteeId })
      .select()
      .single();

    if (error) {
      console.error('Invitation error:', error);
      throw error;
    }
    res.json(data);
  } catch (error: any) {
    console.error('Send invitation failed:', error);
    res.status(400).json({ error: error.message });
  }
}

export async function handleGetPendingInvitations(req: Request, res: Response) {
  try {
    const userId = (req as any).user.id;
    console.log('Getting pending invitations for user:', userId);

    const supabase = getSupabaseAdmin();
    const { data: invitations, error } = await supabase
      .from('channel_invitations')
      .select('*')
      .eq('invitee_id', userId)
      .eq('status', 'pending');

    if (error) throw error;

    // Fetch related data separately
    const enrichedData = await Promise.all(
      (invitations || []).map(async (inv) => {
        const [channelRes, inviterRes] = await Promise.all([
          supabase.from('channels').select('*').eq('id', inv.channel_id).single(),
          supabase.from('profiles').select('id, username, avatar_url').eq('id', inv.inviter_id).single()
        ]);
        return {
          ...inv,
          channel: channelRes.data,
          inviter: inviterRes.data
        };
      })
    );

    console.log('Found invitations:', enrichedData);
    res.json(enrichedData);
    return;


  } catch (error: any) {
    console.error('Get invitations failed:', error);
    res.status(400).json({ error: error.message });
  }
}

export async function handleAcceptInvitation(req: Request, res: Response) {
  try {
    const { invitationId } = req.params;
    const userId = (req as any).user.id;

    const supabase = getSupabaseAdmin();
    const { data: invitation, error: invError } = await supabase
      .from('channel_invitations')
      .update({ status: 'accepted' })
      .eq('id', invitationId)
      .eq('invitee_id', userId)
      .select()
      .single();

    if (invError) throw invError;

    // Get channel to find server_id
    const { data: channel } = await supabase
      .from('channels')
      .select('server_id')
      .eq('id', invitation.channel_id)
      .single();

    // Add user to server members
    await supabase
      .from('server_members')
      .insert({ server_id: channel.server_id, user_id: userId, role: 'member' })
      .select();

    // Add user to channel members
    await supabase
      .from('channel_members')
      .insert({ channel_id: invitation.channel_id, user_id: userId });

    res.json(invitation);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function handleDeclineInvitation(req: Request, res: Response) {
  try {
    const { invitationId } = req.params;
    const userId = (req as any).user.id;

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from('channel_invitations')
      .update({ status: 'declined' })
      .eq('id', invitationId)
      .eq('invitee_id', userId)
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function handleGetChannelMembers(req: Request, res: Response) {
  try {
    const { channelId } = req.params;
    console.log('Getting channel members for:', channelId);

    const supabase = getSupabaseAdmin();
    const { data: members, error } = await supabase
      .from('channel_members')
      .select('*')
      .eq('channel_id', channelId);

    if (error) {
      console.error('Error fetching members:', error);
      throw error;
    }

    console.log('Found members:', members);

    // Get channel to find server_id
    const { data: channel } = await supabase
      .from('channels')
      .select('server_id')
      .eq('id', channelId)
      .single();

    // Fetch user profiles and roles separately
    const enrichedMembers = await Promise.all(
      (members || []).map(async (member) => {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('id, username, avatar_url, status')
          .eq('id', member.user_id)
          .single();
        
        if (profileError) {
          console.error('Error fetching profile for user:', member.user_id, profileError);
        }
        
        // Fetch member roles from server
        const { data: memberRoles } = await supabase
          .from('member_roles')
          .select('id, role_id')
          .eq('user_id', member.user_id)
          .eq('server_id', channel?.server_id);

        console.log('Member roles for', member.user_id, ':', memberRoles);

        // Fetch role details
        const rolesWithDetails = await Promise.all(
          (memberRoles || []).map(async (mr) => {
            const { data: role } = await supabase
              .from('server_roles')
              .select('*')
              .eq('id', mr.role_id)
              .single();
            return { ...mr, role };
          })
        );

        // Sort roles by position (highest first)
        rolesWithDetails.sort((a, b) => (b.role?.position || 0) - (a.role?.position || 0));
        
        console.log('Profile for', member.user_id, ':', profile);
        console.log('Roles with details for', member.user_id, ':', rolesWithDetails);
        
        return {
          ...member,
          user: profile,
          roles: rolesWithDetails
        };
      })
    );

    console.log('Enriched members:', enrichedMembers);
    res.json(enrichedMembers);
  } catch (error: any) {
    console.error('Get channel members failed:', error);
    res.status(400).json({ error: error.message });
  }
}

export async function handleRemoveMember(req: Request, res: Response) {
  try {
    const { channelId, userId } = req.params;

    const supabase = getSupabaseAdmin();
    const { error } = await supabase
      .from('channel_members')
      .delete()
      .eq('channel_id', channelId)
      .eq('user_id', userId);

    if (error) throw error;
    res.json({ success: true });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function handleLeaveChannel(req: Request, res: Response) {
  try {
    const { channelId } = req.params;
    const userId = (req as any).user.id;

    const supabase = getSupabaseAdmin();
    const { error } = await supabase
      .from('channel_members')
      .delete()
      .eq('channel_id', channelId)
      .eq('user_id', userId);

    if (error) throw error;
    res.json({ success: true });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function handleGetChannelMessages(req: Request, res: Response) {
  try {
    const { channelId } = req.params;
    const limit = parseInt(req.query.limit as string) || 50;

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from('messages')
      .select(`
        *,
        author:profiles!author_id(id, username, avatar_url)
      `)
      .eq('channel_id', channelId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    res.json((data || []).reverse());
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function handleSendChannelMessage(req: Request, res: Response) {
  try {
    const { channelId } = req.params;
    const { content } = req.body;
    const authorId = (req as any).user.id;

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from('messages')
      .insert({ channel_id: channelId, author_id: authorId, content })
      .select(`
        *,
        author:profiles!author_id(id, username, avatar_url)
      `)
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

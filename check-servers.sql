-- Check if servers table exists and has data
SELECT COUNT(*) as server_count FROM servers;

-- View all servers
SELECT id, name, owner_id, created_at FROM servers ORDER BY created_at DESC;

-- Check server_members
SELECT COUNT(*) as member_count FROM server_members;

-- Check channels
SELECT COUNT(*) as channel_count FROM channels;

# Role Assignment Guide

## How to Give Roles to Users

### Step 1: Add MembersList Component
In your server page/component, import and use:

```tsx
import { MembersList } from '@/components/server/MembersList';

// In your component
<MembersList serverId={serverId} isOwner={isOwner} />
```

### Step 2: View Members
- Component displays all server members
- Each member shows their username and current roles (colored badges)
- Only server owners see the settings icon

### Step 3: Open Role Assignment
- Click the ⚙️ (Settings) icon next to any member
- Modal opens showing all server roles

### Step 4: Assign/Remove Roles
- Click "Assign" button to give a role to the member
- Click "Remove" button to revoke a role from the member
- Changes are instant with toast notifications

### Step 5: Manage Roles (Optional)
To create/edit roles first:

```tsx
import { RoleManagementModal } from '@/components/server/RoleManagementModal';

// Show modal
<RoleManagementModal serverId={serverId} onClose={() => setShowModal(false)} />
```

## Example Integration

```tsx
import { useState } from 'react';
import { MembersList } from '@/components/server/MembersList';
import { RoleManagementModal } from '@/components/server/RoleManagementModal';

function ServerPage({ serverId, isOwner }) {
  const [showRoleModal, setShowRoleModal] = useState(false);

  return (
    <div>
      {/* Your server content */}
      
      {/* Members list with role assignment */}
      <MembersList serverId={serverId} isOwner={isOwner} />
      
      {/* Optional: Button to manage roles */}
      {isOwner && (
        <button onClick={() => setShowRoleModal(true)}>
          Manage Roles
        </button>
      )}
      
      {showRoleModal && (
        <RoleManagementModal 
          serverId={serverId} 
          onClose={() => setShowRoleModal(false)} 
        />
      )}
    </div>
  );
}
```

## API Usage (Alternative)

If you want to assign roles programmatically:

```tsx
import { roleService } from '@/services/roleService';

// Assign role
await roleService.assignRole(serverId, userId, roleId);

// Remove role
await roleService.removeRole(serverId, userId, roleId);

// Get member's roles
const roles = await roleService.getMemberRoles(serverId, userId);
```

## Permissions
- Only server owners can assign/remove roles
- RLS policies enforce this at database level
- Users automatically get @everyone role when joining

import React from 'react';
import { ServerRole } from '@/types/role';

interface RoleBadgeProps {
  role: ServerRole;
  size?: 'sm' | 'md';
  showDot?: boolean;
}

export function RoleBadge({ role, size = 'sm', showDot = true }: RoleBadgeProps) {
  const sizeClasses = {
    sm: 'text-xs px-1.5 py-0.5',
    md: 'text-sm px-2 py-1'
  };

  return (
    <span 
      className={`inline-flex items-center gap-1 rounded font-medium ${sizeClasses[size]}`}
      style={{ 
        backgroundColor: `${role.color}20`,
        color: role.color
      }}
    >
      {showDot && (
        <span 
          className="w-2 h-2 rounded-full"
          style={{ backgroundColor: role.color }}
        />
      )}
      {role.name}
    </span>
  );
}

import { MemberRole } from '@/types/role';

export function getUserRoleColor(memberRoles: MemberRole[]): string {
  if (!memberRoles || memberRoles.length === 0) return '#ffffff';
  
  const sortedRoles = [...memberRoles].sort((a, b) => 
    (b.role?.position || 0) - (a.role?.position || 0)
  );
  
  return sortedRoles[0]?.role?.color || '#ffffff';
}

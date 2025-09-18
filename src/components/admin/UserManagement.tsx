import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RoleService, AppRole } from '@/services/roleService';
import { AuthService } from '@/services/authService';
import { useToast } from '@/hooks/use-toast';
import { Crown, Shield, Star, User } from 'lucide-react';

interface UserRole {
  id: string;
  user_id: string;
  role: AppRole;
  created_at: string;
  updated_at: string;
  profiles: {
    first_name: string;
    last_name: string;
    email: string;
  };
}

export const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<UserRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [canManageUsers, setCanManageUsers] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      
      const canManage = await AuthService.canManageUsers();
      setCanManageUsers(canManage);

      if (canManage) {
        const userRoles = await RoleService.getAllUserRoles();
        setUsers(userRoles);
      }
      
      setLoading(false);
    };

    loadData();
  }, []);

  const handleRoleChange = async (userId: string, newRole: AppRole) => {
    const success = await RoleService.updateUserRole(userId, newRole);
    
    if (success) {
      toast({
        title: "Role updated",
        description: "User role has been successfully updated.",
      });
      
      // Refresh the user list
      const userRoles = await RoleService.getAllUserRoles();
      setUsers(userRoles);
    } else {
      toast({
        title: "Error",
        description: "Failed to update user role.",
        variant: "destructive",
      });
    }
  };

  const getRoleIcon = (role: AppRole) => {
    switch (role) {
      case 'superadmin':
        return <Crown className="h-4 w-4" />;
      case 'admin':
        return <Shield className="h-4 w-4" />;
      case 'paid':
        return <Star className="h-4 w-4" />;
      default:
        return <User className="h-4 w-4" />;
    }
  };

  const getRoleColor = (role: AppRole) => {
    switch (role) {
      case 'superadmin':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'admin':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'paid':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loading...</CardTitle>
        </CardHeader>
      </Card>
    );
  }

  if (!canManageUsers) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
          <CardDescription>
            You need superadmin privileges to manage users.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Management</CardTitle>
        <CardDescription>
          Manage user roles and permissions across the platform.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Current Role</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((userRole) => (
              <TableRow key={userRole.id}>
                <TableCell className="font-medium">
                  {userRole.profiles.first_name} {userRole.profiles.last_name}
                </TableCell>
                <TableCell>{userRole.profiles.email}</TableCell>
                <TableCell>
                  <Badge className={`${getRoleColor(userRole.role)} flex items-center gap-1 w-fit`}>
                    {getRoleIcon(userRole.role)}
                    {RoleService.getRoleDisplayName(userRole.role)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Select
                    value={userRole.role}
                    onValueChange={(newRole: AppRole) => 
                      handleRoleChange(userRole.user_id, newRole)
                    }
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="free">Free User</SelectItem>
                      <SelectItem value="paid">Paid User</SelectItem>
                      <SelectItem value="admin">Administrator</SelectItem>
                      <SelectItem value="superadmin">Super Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
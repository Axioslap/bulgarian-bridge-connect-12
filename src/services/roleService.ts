import { supabase } from "@/integrations/supabase/client";

export type AppRole = 'free' | 'paid' | 'admin' | 'superadmin';

export class RoleService {
  static async getUserRole(userId: string): Promise<AppRole | null> {
    try {
      const { data, error } = await supabase.rpc('get_user_role', {
        _user_id: userId
      });

      if (error) {
        console.error('Error fetching user role:', error);
        return null;
      }

      return data as AppRole;
    } catch (error) {
      console.error('Error in getUserRole:', error);
      return null;
    }
  }

  static async hasRole(userId: string, role: AppRole): Promise<boolean> {
    try {
      const { data, error } = await supabase.rpc('has_role', {
        _user_id: userId,
        _role: role
      });

      if (error) {
        console.error('Error checking role:', error);
        return false;
      }

      return data || false;
    } catch (error) {
      console.error('Error in hasRole:', error);
      return false;
    }
  }

  static async hasRoleOrHigher(userId: string, minRole: AppRole): Promise<boolean> {
    try {
      const { data, error } = await supabase.rpc('has_role_or_higher', {
        _user_id: userId,
        _min_role: minRole
      });

      if (error) {
        console.error('Error checking role hierarchy:', error);
        return false;
      }

      return data || false;
    } catch (error) {
      console.error('Error in hasRoleOrHigher:', error);
      return false;
    }
  }

  static async getAllUserRoles() {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select(`
          id,
          user_id,
          role,
          created_at,
          updated_at
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching all user roles:', error);
        return [];
      }

      // Get profile data separately due to join limitations
      const userRolesWithProfiles = await Promise.all(
        (data || []).map(async (userRole) => {
          const { data: profile } = await supabase
            .from('profiles')
            .select('first_name, last_name, email')
            .eq('user_id', userRole.user_id)
            .single();

          return {
            ...userRole,
            profiles: profile || { first_name: '', last_name: '', email: '' }
          };
        })
      );

      return userRolesWithProfiles;
    } catch (error) {
      console.error('Error in getAllUserRoles:', error);
      return [];
    }
  }

  static async updateUserRole(userId: string, newRole: AppRole): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('user_roles')
        .upsert({
          user_id: userId,
          role: newRole
        }, {
          onConflict: 'user_id,role'
        });

      if (error) {
        console.error('Error updating user role:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in updateUserRole:', error);
      return false;
    }
  }

  static getRoleHierarchy(): Record<AppRole, number> {
    return {
      free: 1,
      paid: 2,
      admin: 3,
      superadmin: 4
    };
  }

  static getRoleDisplayName(role: AppRole): string {
    const displayNames: Record<AppRole, string> = {
      free: 'Free User',
      paid: 'Paid User',
      admin: 'Administrator',
      superadmin: 'Super Administrator'
    };
    return displayNames[role];
  }
}
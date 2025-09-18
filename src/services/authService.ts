import { supabase } from "@/integrations/supabase/client";
import { RoleService, AppRole } from "./roleService";
import { User, Session } from "@supabase/supabase-js";

export interface AuthUser extends User {
  role?: AppRole;
}

export class AuthService {
  static async getCurrentUser(): Promise<AuthUser | null> {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error || !user) {
        return null;
      }

      const role = await RoleService.getUserRole(user.id);
      
      return {
        ...user,
        role: role || 'free'
      };
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }

  static async getCurrentSession(): Promise<Session | null> {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Error getting session:', error);
        return null;
      }

      return session;
    } catch (error) {
      console.error('Error in getCurrentSession:', error);
      return null;
    }
  }

  static async signOut(): Promise<void> {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error signing out:', error);
      }
    } catch (error) {
      console.error('Error in signOut:', error);
    }
  }

  static async requireMinRole(minRole: AppRole): Promise<boolean> {
    const user = await this.getCurrentUser();
    
    if (!user) {
      return false;
    }

    return await RoleService.hasRoleOrHigher(user.id, minRole);
  }

  static async requireExactRole(role: AppRole): Promise<boolean> {
    const user = await this.getCurrentUser();
    
    if (!user) {
      return false;
    }

    return await RoleService.hasRole(user.id, role);
  }

  static async isAuthenticated(): Promise<boolean> {
    const session = await this.getCurrentSession();
    return !!session;
  }

  static async canAccessAdminPanel(): Promise<boolean> {
    return await this.requireMinRole('admin');
  }

  static async canManageUsers(): Promise<boolean> {
    return await this.requireMinRole('superadmin');
  }

  static async canModerateContent(): Promise<boolean> {
    return await this.requireMinRole('admin');
  }

  static async canAccessPremiumFeatures(): Promise<boolean> {
    return await this.requireMinRole('paid');
  }
}
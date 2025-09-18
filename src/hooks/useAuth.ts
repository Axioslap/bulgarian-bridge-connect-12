import { useState, useEffect } from 'react';
import { AuthService, AuthUser } from '@/services/authService';
import { RoleService, AppRole } from '@/services/roleService';
import { supabase } from '@/integrations/supabase/client';

export const useAuth = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<AppRole | null>(null);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          const userRole = await RoleService.getUserRole(session.user.id);
          const authUser: AuthUser = {
            ...session.user,
            role: userRole || 'free'
          };
          setUser(authUser);
          setRole(userRole || 'free');
        } else {
          setUser(null);
          setRole(null);
        }
        setLoading(false);
      }
    );

    // Check for existing session
    AuthService.getCurrentUser().then((currentUser) => {
      setUser(currentUser);
      setRole(currentUser?.role || null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const hasRole = async (requiredRole: AppRole): Promise<boolean> => {
    if (!user) return false;
    return await RoleService.hasRole(user.id, requiredRole);
  };

  const hasRoleOrHigher = async (minRole: AppRole): Promise<boolean> => {
    if (!user) return false;
    return await RoleService.hasRoleOrHigher(user.id, minRole);
  };

  const canAccessAdminPanel = async (): Promise<boolean> => {
    return await hasRoleOrHigher('admin');
  };

  const signOut = async (): Promise<void> => {
    await AuthService.signOut();
  };

  return {
    user,
    role,
    loading,
    hasRole,
    hasRoleOrHigher,
    canAccessAdminPanel,
    signOut,
    isAuthenticated: !!user
  };
};
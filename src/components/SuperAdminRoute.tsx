import { ReactNode, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';

interface SuperAdminRouteProps {
  children: ReactNode;
  redirectTo?: string;
}

const SuperAdminRoute = ({ children, redirectTo = "/" }: SuperAdminRouteProps) => {
  const { user, loading } = useAuth();
  const [isSuperAdmin, setIsSuperAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    const checkSuperAdminRole = async () => {
      if (!user) {
        setIsSuperAdmin(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .rpc('has_role_or_higher', {
            _user_id: user.id,
            _min_role: 'superadmin'
          });

        if (error) {
          console.error('Error checking superadmin role:', error);
          setIsSuperAdmin(false);
          return;
        }

        setIsSuperAdmin(data);
      } catch (error) {
        console.error('Error in role check:', error);
        setIsSuperAdmin(false);
      }
    };

    if (!loading) {
      checkSuperAdminRole();
    }
  }, [user, loading]);

  if (loading || isSuperAdmin === null) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Verifying access permissions...</p>
        </div>
      </div>
    );
  }

  if (!user || !isSuperAdmin) {
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
};

export default SuperAdminRoute;
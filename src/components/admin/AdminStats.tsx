import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, MessageSquare, Calendar, TrendingUp } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Stats {
  totalUsers: number;
  totalDiscussions: number;
  totalEvents: number;
  totalExperts: number;
}

export const AdminStats: React.FC = () => {
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalDiscussions: 0,
    totalEvents: 0,
    totalExperts: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [usersResult, discussionsResult, eventsResult, expertsResult] = await Promise.all([
          supabase.from('profiles').select('id', { count: 'exact', head: true }),
          supabase.from('discussions').select('id', { count: 'exact', head: true }),
          supabase.from('events').select('id', { count: 'exact', head: true }),
          supabase.from('experts').select('id', { count: 'exact', head: true })
        ]);

        setStats({
          totalUsers: usersResult.count || 0,
          totalDiscussions: discussionsResult.count || 0,
          totalEvents: eventsResult.count || 0,
          totalExperts: expertsResult.count || 0
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: Users,
      description: 'Registered platform users',
      color: 'text-blue-600'
    },
    {
      title: 'Discussions',
      value: stats.totalDiscussions,
      icon: MessageSquare,
      description: 'Community discussions',
      color: 'text-green-600'
    },
    {
      title: 'Events',
      value: stats.totalEvents,
      icon: Calendar,
      description: 'Scheduled events',
      color: 'text-purple-600'
    },
    {
      title: 'Experts',
      value: stats.totalExperts,
      icon: TrendingUp,
      description: 'Registered experts',
      color: 'text-orange-600'
    }
  ];

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Loading...</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-8 w-20 bg-muted animate-pulse rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Platform Overview</CardTitle>
          <CardDescription>
            Key metrics and platform health indicators.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">User Engagement</span>
              <span className="text-sm text-muted-foreground">Active</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">System Status</span>
              <span className="text-sm text-green-600">Operational</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Database Health</span>
              <span className="text-sm text-green-600">Good</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
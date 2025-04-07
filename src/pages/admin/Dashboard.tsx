import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Users, ListChecks, Gift, Coins } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import AdminStats from '@/components/admin/AdminStats';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getSystemStats } from '@/lib/api';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);
        const stats = await getSystemStats();
        setStats(stats);
      } catch (error) {
        console.error('Error fetching system stats:', error);
        // Set default values if fetch fails
        setStats({
          totalUsers: 0,
          totalTasks: 0, 
          totalRewards: 0,
          totalPoints: 0
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statsItems = [
    {
      title: 'Total Users',
      value: stats?.totalUsers || 0,
      icon: Users
    },
    {
      title: 'Active Tasks',
      value: stats?.totalTasks || 0,
      icon: ListChecks
    },
    {
      title: 'Available Rewards',
      value: stats?.totalRewards || 0,
      icon: Gift
    },
    {
      title: 'Total Points',
      value: stats?.totalPoints?.toLocaleString() || 0,
      description: 'Points across all users',
      icon: Coins
    }
  ];
  
  // Mock data for charts
  const userActivityData = [
    { name: 'Mon', tasks: 12, rewards: 4 },
    { name: 'Tue', tasks: 19, rewards: 6 },
    { name: 'Wed', tasks: 15, rewards: 5 },
    { name: 'Thu', tasks: 22, rewards: 7 },
    { name: 'Fri', tasks: 30, rewards: 12 },
    { name: 'Sat', tasks: 18, rewards: 8 },
    { name: 'Sun', tasks: 10, rewards: 3 }
  ];
  
  const userGrowthData = [
    { month: 'Jan', users: 30 },
    { month: 'Feb', users: 58 },
    { month: 'Mar', users: 85 },
    { month: 'Apr', users: 120 },
    { month: 'May', users: 150 },
    { month: 'Jun', users: 210 }
  ];
  
  return (
    <AdminLayout title="Dashboard" description="Admin system dashboard with key metrics">
      <div className="space-y-6">
        <AdminStats 
          totalUsers={stats?.totalUsers || 0}
          totalTasks={stats?.totalTasks || 0}
          totalRewards={stats?.totalRewards || 0}
          totalPoints={stats?.totalPoints || 0}
        />
        
        <Tabs defaultValue="overview" className="space-y-4" onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="activity">User Activity</TabsTrigger>
            <TabsTrigger value="growth">User Growth</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Platform Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Welcome to the admin dashboard. Here you can monitor the platform's 
                  performance and manage users, tasks, and rewards.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="activity" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>User Activity (Last 7 Days)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={userActivityData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="tasks" name="Tasks Completed" fill="#4f46e5" />
                      <Bar dataKey="rewards" name="Rewards Redeemed" fill="#06b6d4" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="growth" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>User Growth</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={userGrowthData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="users" name="Total Users" stroke="#4f46e5" activeDot={{ r: 8 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;

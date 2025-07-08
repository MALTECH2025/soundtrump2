
import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { AnimatedTransition } from '@/components/ui/AnimatedTransition';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useAuth } from '@/context/AuthContext';
import { useRealtimeData } from '@/hooks/useRealtimeData';
import { fetchUserTasks, fetchUserRewards, fetchTasks } from '@/lib/api';
import StatsOverview from '@/components/dashboard/StatsOverview';
import QuickActions from '@/components/dashboard/QuickActions';
import TaskCard from '@/components/dashboard/TaskCard';
import MiningWidget from '@/components/dashboard/MiningWidget';
import ReferralWidget from '@/components/dashboard/ReferralWidget';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Dashboard = () => {
  const { isAuthenticated, user: authUser, profile } = useAuth();
  
  // Enable realtime updates
  useRealtimeData();

  const { data: userTasks = [] } = useQuery({
    queryKey: ['userTasks', authUser?.id],
    queryFn: () => fetchUserTasks(authUser?.id || ''),
    enabled: isAuthenticated && !!authUser?.id,
  });

  const { data: userRewards = [] } = useQuery({
    queryKey: ['userRewards', authUser?.id],
    queryFn: () => fetchUserRewards(authUser?.id || ''),
    enabled: isAuthenticated && !!authUser?.id,
  });

  // Fetch available tasks for the dashboard
  const { data: availableTasks = [] } = useQuery({
    queryKey: ['tasks'],
    queryFn: fetchTasks,
    enabled: isAuthenticated,
  });

  // Calculate user stats
  const userStats = {
    totalPoints: profile?.points || 0,
    tasksCompleted: userTasks.filter((task: any) => task.status === 'Completed').length,
    referrals: 0, // This would come from referrals query
    rewardsRedeemed: userRewards.length,
    tier: profile?.tier || 'Free',
    rank: 1 // This would come from leaderboard position
  };

  // Convert database tasks to dashboard format
  const recentTasks = availableTasks.slice(0, 3).map((task: any) => ({
    id: task.id,
    title: task.title,
    description: task.description,
    reward: task.points,
    category: getCategoryFromTask(task),
    expiresAt: new Date(task.expires_at || Date.now() + 24 * 60 * 60 * 1000),
    progress: getTaskProgress(task.id, userTasks),
    completed: isTaskCompleted(task.id, userTasks)
  }));

  // Helper functions
  const getCategoryFromTask = (task: any) => {
    if (!task.category) return 'other';
    const categoryName = task.category.name?.toLowerCase() || '';
    if (categoryName.includes('music') || categoryName.includes('spotify')) return 'music';
    if (categoryName.includes('social')) return 'social';
    if (categoryName.includes('daily')) return 'daily';
    if (categoryName.includes('referral')) return 'referral';
    return 'other';
  };

  const getTaskProgress = (taskId: string, userTasks: any[]) => {
    const userTask = userTasks.find((ut: any) => ut.task_id === taskId);
    if (!userTask) return 0;
    switch (userTask.status) {
      case 'Pending': return 25;
      case 'Submitted': return 75;
      case 'Completed': return 100;
      default: return 0;
    }
  };

  const isTaskCompleted = (taskId: string, userTasks: any[]) => {
    const userTask = userTasks.find((ut: any) => ut.task_id === taskId);
    return userTask?.status === 'Completed';
  };

  if (!isAuthenticated) {
    return (
      <AnimatedTransition>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-grow pt-24 pb-12 flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-2xl font-bold mb-4">Please log in to view your dashboard</h1>
              <p className="text-muted-foreground">Sign in to your account to access your personalized dashboard.</p>
            </div>
          </main>
          <Footer />
        </div>
      </AnimatedTransition>
    );
  }

  return (
    <AnimatedTransition>
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Navbar />
        
        <main className="flex-grow pt-24 pb-12">
          <div className="container px-4 mx-auto">
            {/* Welcome Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-8"
            >
              <h1 className="text-3xl font-bold mb-2">
                Welcome back, {profile?.full_name || profile?.username || 'User'}! 👋
              </h1>
              <p className="text-muted-foreground">
                Here's your SoundTrump dashboard overview for today
              </p>
            </motion.div>

            {/* Stats Overview */}
            <StatsOverview userStats={userStats} />

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Tasks and Actions */}
              <div className="lg:col-span-2 space-y-6">
                {/* Quick Actions */}
                <QuickActions />

                {/* Recent Tasks */}
                <Card>
                  <CardHeader>
                    <CardTitle>Available Tasks</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {recentTasks.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {recentTasks.map((task) => (
                          <TaskCard key={task.id} task={task} />
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground">No tasks available at the moment.</p>
                        <p className="text-sm text-muted-foreground mt-2">Check back later for new opportunities!</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Right Column - Widgets */}
              <div className="space-y-6">
                {/* Mining Widget */}
                <MiningWidget />
                
                {/* Referral Widget */}
                <ReferralWidget 
                  totalReferrals={42}
                  influencerThreshold={500}
                  referralCode="SOUNDFAN2024"
                  isInfluencer={false}
                />

                {/* Activity Feed */}
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {userTasks.slice(0, 3).map((userTask: any, index: number) => (
                        <div key={userTask.id} className={`flex items-center gap-3 p-2 rounded-lg ${
                          userTask.status === 'Completed' ? 'bg-green-50' : 
                          userTask.status === 'Submitted' ? 'bg-blue-50' : 'bg-gray-50'
                        }`}>
                          <div className={`w-2 h-2 rounded-full ${
                            userTask.status === 'Completed' ? 'bg-green-500' : 
                            userTask.status === 'Submitted' ? 'bg-blue-500' : 'bg-gray-500'
                          }`}></div>
                          <div className="text-sm">
                            <span className="font-medium">
                              {userTask.status === 'Completed' ? 'Task completed:' : 
                               userTask.status === 'Submitted' ? 'Task submitted:' : 'Task started:'}
                            </span> {userTask.task?.title || 'Unknown Task'}
                          </div>
                        </div>
                      ))}
                      {userTasks.length === 0 && (
                        <div className="text-center py-4">
                          <p className="text-muted-foreground text-sm">No recent activity</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    </AnimatedTransition>
  );
};

export default Dashboard;

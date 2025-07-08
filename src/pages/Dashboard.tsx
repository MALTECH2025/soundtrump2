import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { AnimatedTransition } from '@/components/ui/AnimatedTransition';
import { Skeleton } from '@/components/ui/skeleton';
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
import { TaskProps } from '@/types';

const Dashboard = () => {
  const { isAuthenticated, user: authUser, profile } = useAuth();
  
  // Enable realtime updates
  useRealtimeData();

  const { data: userTasks = [], isLoading: userTasksLoading } = useQuery({
    queryKey: ['userTasks', authUser?.id],
    queryFn: () => fetchUserTasks(authUser?.id || ''),
    enabled: isAuthenticated && !!authUser?.id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });

  const { data: userRewards = [], isLoading: rewardsLoading } = useQuery({
    queryKey: ['userRewards', authUser?.id],
    queryFn: () => fetchUserRewards(authUser?.id || ''),
    enabled: isAuthenticated && !!authUser?.id,
    staleTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
  });

  const { data: availableTasks = [], isLoading: tasksLoading } = useQuery({
    queryKey: ['tasks'],
    queryFn: fetchTasks,
    enabled: isAuthenticated,
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchOnWindowFocus: false,
  });

  // Helper functions
  const getCategoryFromTask = (task: any): TaskProps['category'] => {
    if (!task.category) return 'other';
    const categoryName = task.category.name?.toLowerCase() || '';
    if (categoryName.includes('music') || categoryName.includes('spotify')) return 'spotify';
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

  // Calculate user stats
  const userStats = {
    totalPoints: profile?.points || 0,
    tasksCompleted: userTasks.filter((task: any) => task.status === 'Completed').length,
    referrals: 0,
    rewardsRedeemed: userRewards.length,
    tier: profile?.tier || 'Free',
    rank: 1
  };

  // Convert database tasks to dashboard format
  const recentTasks = availableTasks.slice(0, 3).map((task: any): TaskProps => ({
    id: task.id,
    title: task.title,
    description: task.description,
    reward: task.points,
    category: getCategoryFromTask(task),
    expiresAt: new Date(task.expires_at || Date.now() + 24 * 60 * 60 * 1000),
    progress: getTaskProgress(task.id, userTasks),
    completed: isTaskCompleted(task.id, userTasks)
  }));

  if (!isAuthenticated) {
    return (
      <AnimatedTransition>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-grow pt-20 pb-12 flex items-center justify-center px-4">
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
        
        <main className="flex-grow pt-20 pb-12">
          <div className="container px-4 mx-auto max-w-7xl">
            {/* Welcome Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-6"
            >
              <h1 className="text-2xl md:text-3xl font-bold mb-2">
                Welcome back, {profile?.full_name || profile?.username || 'User'}! 👋
              </h1>
              <p className="text-muted-foreground text-sm md:text-base">
                Here's your SoundTrump dashboard overview for today
              </p>
            </motion.div>

            {/* Stats Overview */}
            <StatsOverview userStats={userStats} />

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
              {/* Left Column - Tasks and Actions */}
              <div className="lg:col-span-2 space-y-4 md:space-y-6">
                {/* Quick Actions */}
                <QuickActions />

                {/* Recent Tasks */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg md:text-xl">Available Tasks</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {tasksLoading ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="space-y-3">
                            <Skeleton className="h-4 w-3/4" />
                            <Skeleton className="h-3 w-full" />
                            <Skeleton className="h-3 w-1/2" />
                          </div>
                        ))}
                      </div>
                    ) : recentTasks.length > 0 ? (
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
              <div className="space-y-4 md:space-y-6">
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
                    <CardTitle className="text-lg">Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {userTasksLoading ? (
                      <div className="space-y-3">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="flex items-center gap-3">
                            <Skeleton className="w-2 h-2 rounded-full" />
                            <Skeleton className="h-3 flex-1" />
                          </div>
                        ))}
                      </div>
                    ) : (
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
                    )}
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

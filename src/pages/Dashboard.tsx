
import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { AnimatedTransition } from '@/components/ui/AnimatedTransition';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useAuth } from '@/context/AuthContext';
import { useRealtimeData } from '@/hooks/useRealtimeData';
import { fetchUserTasks, fetchUserRewards } from '@/lib/api';
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

  // Calculate user stats
  const userStats = {
    totalPoints: profile?.points || 0,
    tasksCompleted: userTasks.filter((task: any) => task.status === 'Completed').length,
    referrals: 0, // This would come from referrals query
    rewardsRedeemed: userRewards.length,
    tier: profile?.tier || 'Free',
    rank: 1 // This would come from leaderboard position
  };

  // Sample recent tasks for the dashboard
  const recentTasks = [
    {
      id: '1',
      title: 'Daily Check-in',
      description: 'Complete your daily check-in',
      reward: 25,
      category: 'daily' as const,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      progress: 0,
      completed: false
    },
    {
      id: '2',
      title: 'Follow on Spotify',
      description: 'Follow SoundTrump on Spotify',
      reward: 50,
      category: 'spotify' as const,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      progress: 0,
      completed: false
    },
    {
      id: '3',
      title: 'Share on Twitter',
      description: 'Share SoundTrump on Twitter',
      reward: 80,
      category: 'social' as const,
      expiresAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      progress: 50,
      completed: false
    }
  ];

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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {recentTasks.map((task) => (
                        <TaskCard key={task.id} task={task} />
                      ))}
                    </div>
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
                      <div className="flex items-center gap-3 p-2 bg-green-50 rounded-lg">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <div className="text-sm">
                          <span className="font-medium">Task completed:</span> Daily Check-in
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-2 bg-blue-50 rounded-lg">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <div className="text-sm">
                          <span className="font-medium">Mining:</span> Earned 15 ST coins
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-2 bg-purple-50 rounded-lg">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <div className="text-sm">
                          <span className="font-medium">Referral:</span> New friend joined
                        </div>
                      </div>
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


import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AnimatedTransition } from '@/components/ui/AnimatedTransition';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import TaskCard from '@/components/dashboard/TaskCard';
import RankDisplay from '@/components/dashboard/RankDisplay';
import EarningsWidget from '@/components/dashboard/EarningsWidget';
import ReferralWidget from '@/components/dashboard/ReferralWidget';
import { Bell, Music2, Award, TrendingUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/lib/toast';
import { useAuth } from '@/context/AuthContext';
import { useProfile } from '@/context/ProfileContext';
import { fetchTasks, fetchUserTasks, fetchUserReferrals, fetchReferralCode } from '@/lib/api';
import { UserTask, Task } from '@/types';

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated, user: authUser } = useAuth();
  const { user } = useProfile();
  
  // Fetch active tasks using React Query
  const { data: tasks = [] } = useQuery({
    queryKey: ['tasks'],
    queryFn: fetchTasks,
    enabled: isAuthenticated,
  });
  
  // Fetch user's tasks
  const { data: userTasks = [] } = useQuery({
    queryKey: ['userTasks', authUser?.id],
    queryFn: () => fetchUserTasks(authUser?.id || ''),
    enabled: isAuthenticated && !!authUser?.id,
  });
  
  // Fetch user's referrals
  const { data: referrals = [] } = useQuery({
    queryKey: ['referrals', authUser?.id],
    queryFn: () => fetchUserReferrals(authUser?.id || ''),
    enabled: isAuthenticated && !!authUser?.id,
  });
  
  // Fetch user's referral code
  const { data: referralCode } = useQuery({
    queryKey: ['referralCode', authUser?.id],
    queryFn: () => fetchReferralCode(authUser?.id || ''),
    enabled: isAuthenticated && !!authUser?.id,
  });
  
  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    // Show welcome toast
    if (user) {
      toast.success(`Welcome back, ${user.name || 'User'}!`, {
        description: `You have ${tasks.filter(t => t.active).length} active tasks to complete.`,
      });
    }
    
    return () => clearTimeout(timer);
  }, [user, tasks]);
  
  // Calculate active tasks for the user
  const activeTasks = tasks.filter(task => task.active).map(task => {
    // Check if user has already started this task
    const userTask = userTasks.find(ut => ut.task_id === task.id);
    const progress = userTask ? (userTask.status === 'Completed' ? 100 : 60) : 0;
    
    // Convert task to TaskProps format
    return {
      id: task.id,
      title: task.title,
      description: task.description,
      reward: task.points,
      category: task.category?.name?.toLowerCase() === 'spotify' ? 'spotify' : 
               task.category?.name?.toLowerCase() === 'social' ? 'social' : 
               task.category?.name?.toLowerCase() === 'referral' ? 'referral' : 'other',
      expiresAt: new Date(Date.now() + 86400000 * 2), // 2 days from now as placeholder
      progress: progress,
      completed: userTask?.status === 'Completed'
    };
  });
  
  // Calculate user stats
  const completedTasks = userTasks.filter(ut => ut.status === 'Completed');
  const totalEarnings = user?.role ? user.points : 0;
  const pendingEarnings = 0; // This would be calculated from pending tasks
  
  // Calculate user rank based on points
  const rankCalculation = () => {
    const points = totalEarnings;
    if (points < 100) return { rank: 1, name: 'Crystal I', nextName: 'Crystal II', progress: (points / 100) * 100, pointsToNext: 100 - points };
    else if (points < 250) return { rank: 2, name: 'Crystal II', nextName: 'Crystal III', progress: ((points - 100) / 150) * 100, pointsToNext: 250 - points };
    else if (points < 500) return { rank: 3, name: 'Crystal III', nextName: 'Crystal IV', progress: ((points - 250) / 250) * 100, pointsToNext: 500 - points };
    else if (points < 1000) return { rank: 4, name: 'Crystal IV', nextName: 'Crystal V', progress: ((points - 500) / 500) * 100, pointsToNext: 1000 - points };
    else return { rank: 5, name: 'Crystal V', nextName: 'Master', progress: 100, pointsToNext: 0 };
  };
  
  const userRank = rankCalculation();
  
  // Recent activity based on completed tasks and other actions
  const recentActivity = completedTasks.slice(0, 4).map(task => {
    const taskDetails = tasks.find(t => t.id === task.task_id);
    const category = taskDetails?.category?.name || 'Task';
    const title = taskDetails?.title || 'Completed task';
    const time = task.completed_at ? new Date(task.completed_at) : new Date();
    const timeAgo = Math.floor((Date.now() - time.getTime()) / (1000 * 60 * 60));
    
    return {
      icon: category.toLowerCase() === 'spotify' ? <Music2 className="w-4 h-4" /> : <Bell className="w-4 h-4" />,
      color: category.toLowerCase() === 'spotify' ? 'bg-[#1DB954]/10 text-[#1DB954]' : 'bg-amber-500/10 text-amber-500',
      text: `Completed ${title}`,
      time: timeAgo <= 1 ? 'Just now' : timeAgo < 24 ? `${timeAgo} hours ago` : `${Math.floor(timeAgo / 24)} days ago`,
      amount: task.points_earned ? `+${task.points_earned} ST Coins` : null
    };
  });
  
  // Add some default items if not enough activity
  while (recentActivity.length < 4) {
    recentActivity.push(
      ...[
        { icon: <Bell className="w-4 h-4" />, color: 'bg-amber-500/10 text-amber-500', text: 'New task available: Weekend Challenge', time: '6 hours ago', amount: null },
        { icon: <Award className="w-4 h-4" />, color: 'bg-purple-500/10 text-purple-500', text: `Ranked up to ${userRank.name}`, time: '2 days ago', amount: null },
        { icon: <TrendingUp className="w-4 h-4" />, color: 'bg-green-500/10 text-green-500', text: 'Earned weekly bonus rewards', time: '3 days ago', amount: '+75 ST Coins' }
      ].slice(0, 4 - recentActivity.length)
    );
  }
  
  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <AnimatedTransition>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        
        <main className="flex-grow pt-24 pb-12">
          <div className="container px-4 mx-auto">
            {isLoading ? (
              <div className="animate-pulse">
                <div className="h-8 bg-muted w-1/3 mb-6 rounded"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  <div className="h-64 bg-muted rounded-lg"></div>
                  <div className="h-64 bg-muted rounded-lg"></div>
                  <div className="h-64 bg-muted rounded-lg"></div>
                </div>
                <div className="h-6 bg-muted w-1/4 mb-6 rounded"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="h-48 bg-muted rounded-lg"></div>
                  <div className="h-48 bg-muted rounded-lg"></div>
                  <div className="h-48 bg-muted rounded-lg"></div>
                  <div className="h-48 bg-muted rounded-lg"></div>
                </div>
              </div>
            ) : (
              <>
                <motion.div
                  variants={fadeInUp}
                  initial="hidden"
                  animate="visible"
                  className="mb-6"
                >
                  <div className="flex items-center gap-3">
                    <h1 className="text-3xl font-bold">Welcome back, {user?.name || 'User'}</h1>
                    <div className="flex gap-1.5">
                      {user?.role?.tier === "Premium" && (
                        <Badge className="bg-sound-light">Premium</Badge>
                      )}
                      {user?.role?.status === "Influencer" && (
                        <Badge className="bg-purple-500">Influencer</Badge>
                      )}
                    </div>
                  </div>
                  <p className="text-muted-foreground">Here's an overview of your activity and earnings</p>
                </motion.div>
                
                <motion.div 
                  variants={fadeInUp}
                  initial="hidden"
                  animate="visible"
                  transition={{ staggerChildren: 0.1, delayChildren: 0.2 }}
                  className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
                >
                  <motion.div variants={fadeInUp} className="md:col-span-2">
                    <EarningsWidget 
                      totalEarnings={totalEarnings}
                      pendingEarnings={pendingEarnings} 
                      percentageIncrease={12} // Placeholder
                    />
                  </motion.div>
                  <motion.div variants={fadeInUp}>
                    <RankDisplay
                      currentRank={userRank.rank}
                      rankName={userRank.name}
                      progress={userRank.progress}
                      nextRankName={userRank.nextName}
                      pointsToNextRank={userRank.pointsToNext}
                    />
                  </motion.div>
                </motion.div>
                
                <motion.div 
                  variants={fadeInUp}
                  initial="hidden"
                  animate="visible"
                  className="grid grid-cols-1 lg:grid-cols-4 gap-6"
                >
                  <div className="lg:col-span-3">
                    <Tabs defaultValue="all" className="w-full mb-8">
                      <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold">Your Tasks</h2>
                        <TabsList>
                          <TabsTrigger value="all">All</TabsTrigger>
                          <TabsTrigger value="spotify">Spotify</TabsTrigger>
                          <TabsTrigger value="social">Social</TabsTrigger>
                        </TabsList>
                      </div>
                      
                      <TabsContent value="all" className="m-0">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {activeTasks.length > 0 ? (
                            activeTasks.map((task) => (
                              <TaskCard key={task.id} task={task} />
                            ))
                          ) : (
                            <p>No active tasks available at the moment. Check back later!</p>
                          )}
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="spotify" className="m-0">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {activeTasks
                            .filter(task => task.category === 'spotify')
                            .map((task) => (
                              <TaskCard key={task.id} task={task} />
                            ))}
                          {activeTasks.filter(task => task.category === 'spotify').length === 0 && (
                            <p>No Spotify tasks available at the moment. Check back later!</p>
                          )}
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="social" className="m-0">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {activeTasks
                            .filter(task => task.category === 'social')
                            .map((task) => (
                              <TaskCard key={task.id} task={task} />
                            ))}
                          {activeTasks.filter(task => task.category === 'social').length === 0 && (
                            <p>No Social tasks available at the moment. Check back later!</p>
                          )}
                        </div>
                      </TabsContent>
                    </Tabs>
                    
                    <div className="mt-8">
                      <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
                      <div className="space-y-4">
                        {recentActivity.map((activity, index) => (
                          <div 
                            key={index} 
                            className="p-3 rounded-lg border border-border flex items-center justify-between"
                          >
                            <div className="flex items-center">
                              <div className={`p-2 rounded-full mr-3 ${activity.color}`}>
                                {activity.icon}
                              </div>
                              <div>
                                <p className="font-medium text-sm">{activity.text}</p>
                                <p className="text-xs text-muted-foreground">{activity.time}</p>
                              </div>
                            </div>
                            {activity.amount && (
                              <div className="text-sm font-medium text-sound-light">
                                {activity.amount}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="lg:col-span-1">
                    <ReferralWidget 
                      totalReferrals={referrals.length}
                      influencerThreshold={500}
                      referralCode={referralCode || 'SOUNDFAN2024'}
                      isInfluencer={user?.role?.status === "Influencer"}
                    />
                  </div>
                </motion.div>
              </>
            )}
          </div>
        </main>
        
        <Footer />
      </div>
    </AnimatedTransition>
  );
};

export default Dashboard;

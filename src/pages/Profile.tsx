
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { AnimatedTransition } from '@/components/ui/AnimatedTransition';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useAuth } from '@/context/AuthContext';
import { 
  User, 
  Trophy, 
  Coins, 
  Calendar,
  Star,
  TrendingUp,
  Award,
  Gift,
  Clock
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const Profile = () => {
  const { isAuthenticated, user: authUser, profile } = useAuth();

  // Fetch user's completed tasks with proper relationship hints
  const { data: completedTasks = [], isLoading: tasksLoading } = useQuery({
    queryKey: ['userCompletedTasks', authUser?.id],
    queryFn: async () => {
      if (!authUser?.id) return [];
      
      const { data, error } = await supabase
        .from('user_tasks')
        .select(`
          *,
          task:tasks!user_tasks_task_id_fkey(
            id,
            title,
            points,
            difficulty
          )
        `)
        .eq('user_id', authUser.id)
        .eq('status', 'Completed')
        .order('completed_at', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      return data || [];
    },
    enabled: isAuthenticated && !!authUser?.id,
  });

  // Fetch user's redeemed rewards
  const { data: redeemedRewards = [], isLoading: rewardsLoading } = useQuery({
    queryKey: ['userRedeemedRewards', authUser?.id],
    queryFn: async () => {
      if (!authUser?.id) return [];
      
      const { data, error } = await supabase
        .from('user_rewards')
        .select(`
          *,
          reward:rewards(*)
        `)
        .eq('user_id', authUser.id)
        .order('redeemed_at', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      return data || [];
    },
    enabled: isAuthenticated && !!authUser?.id,
  });

  // Fetch user's referrals
  const { data: referrals = [], isLoading: referralsLoading } = useQuery({
    queryKey: ['userReferrals', authUser?.id],
    queryFn: async () => {
      if (!authUser?.id) return [];
      
      const { data, error } = await supabase
        .from('referred_users')
        .select('*')
        .eq('referrer_id', authUser.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
    enabled: isAuthenticated && !!authUser?.id,
  });

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  if (!isAuthenticated || !profile) {
    return (
      <AnimatedTransition>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-grow pt-24 pb-12 flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-2xl font-bold mb-4">Please log in to view your profile</h1>
              <p className="text-muted-foreground">Sign in to your account to access your profile information.</p>
            </div>
          </main>
          <Footer />
        </div>
      </AnimatedTransition>
    );
  }

  // Calculate user level based on points
  const calculateLevel = (points: number) => {
    return Math.floor(points / 100) + 1;
  };

  // Calculate progress to next level
  const calculateLevelProgress = (points: number) => {
    return (points % 100);
  };

  const userLevel = calculateLevel(profile.points);
  const levelProgress = calculateLevelProgress(profile.points);

  // Combine activities from tasks and rewards
  const recentActivities = [
    ...completedTasks.map((task: any) => ({
      id: task.id,
      type: 'task_completed',
      description: `Completed "${task.task?.title || 'Unknown Task'}"`,
      date: task.completed_at,
      points_earned: task.points_earned || task.task?.points || 0,
    })),
    ...redeemedRewards.map((reward: any) => ({
      id: reward.id,
      type: 'reward_redeemed',
      description: `Redeemed "${reward.reward?.name || 'Unknown Reward'}"`,
      date: reward.redeemed_at,
      points_spent: reward.points_spent,
    }))
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 10);

  return (
    <AnimatedTransition>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        
        <main className="flex-grow pt-24 pb-12">
          <div className="container px-4 mx-auto">
            {/* Profile Header */}
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              className="mb-8"
            >
              <Card className="bg-gradient-to-r from-sound-dark to-sound-medium text-white overflow-hidden">
                <CardContent className="p-8">
                  <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                    <Avatar className="w-24 h-24 border-4 border-white/20">
                      <AvatarImage src={profile.avatar_url || ''} alt={profile.full_name || 'User'} />
                      <AvatarFallback className="text-2xl bg-white/20 text-white">
                        {profile.initials || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-grow">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                          <h1 className="text-3xl font-bold mb-2">
                            {profile.full_name || profile.username || 'Anonymous User'}
                          </h1>
                          <div className="flex items-center gap-4 text-white/80">
                            <span className="flex items-center gap-2">
                              <User className="w-4 h-4" />
                              @{profile.username || 'user'}
                            </span>
                            <Badge variant="secondary" className="bg-white/20 text-white">
                              {profile.tier} User
                            </Badge>
                            <Badge variant="secondary" className="bg-white/20 text-white">
                              Level {userLevel}
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className="flex items-center justify-end gap-2 mb-2">
                            <Coins className="w-6 h-6 text-yellow-400" />
                            <span className="text-2xl font-bold">{profile.points}</span>
                            <span className="text-sm opacity-80">ST</span>
                          </div>
                          <div className="w-32">
                            <Progress value={levelProgress} className="h-2 bg-white/20" />
                            <p className="text-xs text-white/60 mt-1">
                              {levelProgress}/100 to Level {userLevel + 1}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Stats Cards */}
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
            >
              <motion.div variants={fadeInUp}>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Tasks Completed</p>
                        <p className="text-2xl font-bold">{completedTasks.length}</p>
                      </div>
                      <Trophy className="w-8 h-8 text-sound-light" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={fadeInUp}>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Rewards Redeemed</p>
                        <p className="text-2xl font-bold">{redeemedRewards.length}</p>
                      </div>
                      <Gift className="w-8 h-8 text-sound-light" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={fadeInUp}>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Referrals</p>
                        <p className="text-2xl font-bold">{referrals.length}</p>
                      </div>
                      <TrendingUp className="w-8 h-8 text-sound-light" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={fadeInUp}>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Current Level</p>
                        <p className="text-2xl font-bold">{userLevel}</p>
                      </div>
                      <Star className="w-8 h-8 text-sound-light" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>

            {/* Profile Content */}
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
            >
              <Tabs defaultValue="activity" className="w-full">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">Profile Details</h2>
                  <TabsList>
                    <TabsTrigger value="activity">Recent Activity</TabsTrigger>
                    <TabsTrigger value="tasks">Completed Tasks</TabsTrigger>
                    <TabsTrigger value="rewards">Redeemed Rewards</TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="activity" className="m-0">
                  <Card>
                    <CardHeader>
                      <CardTitle>Recent Activity</CardTitle>
                      <CardDescription>Your latest actions and achievements</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {recentActivities.length > 0 ? (
                        <div className="space-y-4">
                          {recentActivities.map((activity) => (
                            <div key={activity.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                              <div className="flex items-center gap-3">
                                {activity.type === 'task_completed' ? (
                                  <Trophy className="w-5 h-5 text-sound-light" />
                                ) : (
                                  <Gift className="w-5 h-5 text-sound-light" />
                                )}
                                <div>
                                  <p className="font-medium">{activity.description}</p>
                                  <p className="text-sm text-muted-foreground">
                                    {new Date(activity.date).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>
                              <div className="text-right">
                                {'points_earned' in activity && (
                                  <span className="text-green-600 font-medium">
                                    +{activity.points_earned} ST
                                  </span>
                                )}
                                {'points_spent' in activity && (
                                  <span className="text-red-600 font-medium">
                                    -{activity.points_spent} ST
                                  </span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <Clock className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                          <h3 className="text-lg font-medium mb-2">No recent activity</h3>
                          <p className="text-muted-foreground">
                            Complete tasks and redeem rewards to see your activity here.
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="tasks" className="m-0">
                  <Card>
                    <CardHeader>
                      <CardTitle>Completed Tasks</CardTitle>
                      <CardDescription>Tasks you've successfully completed</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {tasksLoading ? (
                        <div className="space-y-4">
                          {[1, 2, 3].map((i) => (
                            <div key={i} className="h-16 bg-muted rounded-lg animate-pulse"></div>
                          ))}
                        </div>
                      ) : completedTasks.length > 0 ? (
                        <div className="space-y-4">
                          {completedTasks.map((task: any) => (
                            <div key={task.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                              <div>
                                <h4 className="font-medium">{task.task?.title || 'Unknown Task'}</h4>
                                <div className="flex items-center gap-2 mt-1">
                                  <Badge variant="outline" className="text-xs">
                                    {task.task?.difficulty || 'Easy'}
                                  </Badge>
                                  <span className="text-sm text-muted-foreground">
                                    Completed on {new Date(task.completed_at).toLocaleDateString()}
                                  </span>
                                </div>
                              </div>
                              <div className="text-right">
                                <span className="text-green-600 font-medium">
                                  +{task.points_earned || task.task?.points || 0} ST
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <Trophy className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                          <h3 className="text-lg font-medium mb-2">No completed tasks</h3>
                          <p className="text-muted-foreground">
                            Complete some tasks to see them appear here.
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="rewards" className="m-0">
                  <Card>
                    <CardHeader>
                      <CardTitle>Redeemed Rewards</CardTitle>
                      <CardDescription>Rewards you've claimed with your ST</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {rewardsLoading ? (
                        <div className="space-y-4">
                          {[1, 2].map((i) => (
                            <div key={i} className="h-20 bg-muted rounded-lg animate-pulse"></div>
                          ))}
                        </div>
                      ) : redeemedRewards.length > 0 ? (
                        <div className="space-y-4">
                          {redeemedRewards.map((reward: any) => (
                            <div key={reward.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                              <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                                  <Gift className="w-6 h-6 text-sound-light" />
                                </div>
                                <div>
                                  <h4 className="font-medium">{reward.reward?.name || 'Unknown Reward'}</h4>
                                  <div className="flex items-center gap-2 mt-1">
                                    <Badge variant={reward.status === 'Fulfilled' ? 'default' : 'outline'}>
                                      {reward.status}
                                    </Badge>
                                    <span className="text-sm text-muted-foreground">
                                      Redeemed on {new Date(reward.redeemed_at).toLocaleDateString()}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className="text-right">
                                <span className="text-red-600 font-medium">
                                  -{reward.points_spent} ST
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <Award className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                          <h3 className="text-lg font-medium mb-2">No redeemed rewards</h3>
                          <p className="text-muted-foreground">
                            Redeem some rewards to see them appear here.
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </motion.div>
          </div>
        </main>
        
        <Footer />
      </div>
    </AnimatedTransition>
  );
};

export default Profile;

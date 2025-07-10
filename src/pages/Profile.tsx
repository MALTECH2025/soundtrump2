import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { AnimatedTransition } from '@/components/ui/AnimatedTransition';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useAuth } from '@/context/AuthContext';
import { useProfile } from '@/context/ProfileContext';
import { 
  User, 
  Award, 
  Trophy, 
  Coins, 
  CalendarDays, 
  ChevronRight, 
  Music2, 
  Clock, 
  Star,
  Gift
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from '@/lib/toast';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const Profile = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated, user: authUser } = useAuth();
  const { user } = useProfile();
  
  // Fetch real user activity data
  const { data: userTasks = [] } = useQuery({
    queryKey: ['userTasks', authUser?.id],
    queryFn: async () => {
      if (!authUser?.id) return [];
      
      const { data, error } = await supabase
        .from('user_tasks')
        .select(`
          *,
          task:tasks(title, points)
        `)
        .eq('user_id', authUser.id)
        .order('created_at', { ascending: false })
        .limit(10);
        
      if (error) throw error;
      return data || [];
    },
    enabled: !!authUser?.id,
  });

  // Fetch user rewards
  const { data: userRewards = [] } = useQuery({
    queryKey: ['userRewards', authUser?.id],
    queryFn: async () => {
      if (!authUser?.id) return [];
      
      const { data, error } = await supabase
        .from('user_rewards')
        .select(`
          *,
          reward:rewards(name, points_cost)
        `)
        .eq('user_id', authUser.id)
        .order('redeemed_at', { ascending: false })
        .limit(5);
        
      if (error) throw error;
      return data || [];
    },
    enabled: !!authUser?.id,
  });

  // Fetch referral data
  const { data: referralData } = useQuery({
    queryKey: ['referrals', authUser?.id],
    queryFn: async () => {
      if (!authUser?.id) return { count: 0 };
      
      const { data, error } = await supabase
        .from('referred_users')
        .select('id')
        .eq('referrer_id', authUser.id);
        
      if (error) throw error;
      return { count: data?.length || 0 };
    },
    enabled: !!authUser?.id,
  });

  // Calculate real stats
  const stats = {
    totalPoints: user?.points || 0,
    tasksCompleted: userTasks.filter(task => task.status === 'Completed').length,
    daysActive: Math.ceil((Date.now() - new Date(authUser?.created_at || Date.now()).getTime()) / (1000 * 60 * 60 * 24)),
    referrals: referralData?.count || 0,
    rank: user?.tier || 'Free',
    nextRank: user?.tier === 'Free' ? 'Premium' : 'Elite',
    rankProgress: Math.min((user?.points || 0) / 1000 * 100, 100) // Progress to next rank based on points
  };

  // Format recent activity from real data
  const recentActivity = [
    ...userTasks.slice(0, 3).map(task => ({
      id: `task-${task.id}`,
      type: 'task',
      description: `Completed: ${task.task?.title || 'Task'}`,
      date: task.completed_at || task.created_at,
      reward: task.points_earned || task.task?.points || 0
    })),
    ...userRewards.slice(0, 2).map(reward => ({
      id: `reward-${reward.id}`,
      type: 'reward',
      description: `Redeemed: ${reward.reward?.name || 'Reward'}`,
      date: reward.redeemed_at,
      cost: reward.points_spent
    }))
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };
  
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };
  
  if (!user) {
    return (
      <AnimatedTransition>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-grow pt-24 pb-12 flex items-center justify-center">
            <Card>
              <CardHeader>
                <CardTitle>User Not Found</CardTitle>
                <CardDescription>Please log in to view your profile</CardDescription>
              </CardHeader>
              <CardContent>
                <Link to="/login">
                  <Button>Go to Login</Button>
                </Link>
              </CardContent>
            </Card>
          </main>
          <Footer />
        </div>
      </AnimatedTransition>
    );
  }
  
  return (
    <AnimatedTransition>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        
        <main className="flex-grow pt-24 pb-12">
          <div className="container px-4 mx-auto max-w-5xl">
            {isLoading ? (
              <div className="animate-pulse">
                <div className="flex flex-col md:flex-row gap-6 mb-8">
                  <div className="md:w-1/3 h-64 bg-muted rounded-lg"></div>
                  <div className="md:w-2/3 h-64 bg-muted rounded-lg"></div>
                </div>
                <div className="h-6 bg-muted w-1/4 mb-4 rounded"></div>
                <div className="h-64 bg-muted rounded-lg w-full"></div>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <motion.div 
                    variants={fadeInUp}
                    initial="hidden"
                    animate="visible"
                    className="md:col-span-1"
                  >
                    <Card className="h-full">
                      <CardHeader className="text-center pb-2">
                        <div className="flex justify-center mb-4">
                          <Avatar className="h-24 w-24">
                            <AvatarImage src={user.avatar} alt={user.name} />
                            <AvatarFallback className="text-xl bg-sound-light text-white">
                              {user.initials}
                            </AvatarFallback>
                          </Avatar>
                        </div>
                        <CardTitle className="text-xl">{user.name}</CardTitle>
                        <CardDescription>{user.email}</CardDescription>
                      </CardHeader>
                      
                      <CardContent className="pb-6">
                        <div className="flex flex-col items-center gap-2 mb-4">
                          <div className="flex gap-2">
                            <Badge className="bg-sound-light">{user.role?.tier}</Badge>
                            <Badge variant={user.role?.status === "Influencer" ? "default" : "outline"} 
                                  className={user.role?.status === "Influencer" ? "bg-purple-500" : ""}>
                              {user.role?.status}
                            </Badge>
                          </div>
                          <div className="text-sm text-muted-foreground flex items-center">
                            <Trophy className="h-3.5 w-3.5 mr-1 text-yellow-500" />
                            <span>{stats.rank} Rank</span>
                          </div>
                        </div>
                        
                        <div className="space-y-4">
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Progress to {stats.nextRank}</span>
                              <span>{Math.round(stats.rankProgress)}%</span>
                            </div>
                            <Progress value={stats.rankProgress} className="h-2" />
                          </div>
                          
                          <div className="grid grid-cols-2 gap-2 text-center">
                            <div className="bg-muted/50 rounded-md p-2">
                              <div className="text-2xl font-bold">{stats.totalPoints}</div>
                              <div className="text-xs text-muted-foreground">Total ST</div>
                            </div>
                            <div className="bg-muted/50 rounded-md p-2">
                              <div className="text-2xl font-bold">{stats.daysActive}</div>
                              <div className="text-xs text-muted-foreground">Days Active</div>
                            </div>
                            <div className="bg-muted/50 rounded-md p-2">
                              <div className="text-2xl font-bold">{stats.tasksCompleted}</div>
                              <div className="text-xs text-muted-foreground">Tasks Done</div>
                            </div>
                            <div className="bg-muted/50 rounded-md p-2">
                              <div className="text-2xl font-bold">{stats.referrals}</div>
                              <div className="text-xs text-muted-foreground">Referrals</div>
                            </div>
                          </div>
                          
                          <div className="pt-4">
                            <Link to="/settings">
                              <Button variant="outline" className="w-full">
                                <User className="mr-2 h-4 w-4" />
                                Edit Profile
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                  
                  <motion.div 
                    variants={fadeInUp}
                    initial="hidden"
                    animate="visible"
                    className="md:col-span-2"
                  >
                    <Card className="h-full">
                      <CardHeader className="pb-2">
                        <CardTitle>Recent Activity</CardTitle>
                        <CardDescription>Your latest actions and rewards</CardDescription>
                      </CardHeader>
                      
                      <CardContent>
                        {recentActivity.length > 0 ? (
                          <div className="space-y-4">
                            {recentActivity.map(activity => (
                              <div key={activity.id} className="flex">
                                <div className="mr-4 relative">
                                  <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                                    {activity.type === 'task' && <Music2 className="h-5 w-5 text-sound-light" />}
                                    {activity.type === 'referral' && <User className="h-5 w-5 text-purple-500" />}
                                    {activity.type === 'reward' && <Award className="h-5 w-5 text-amber-500" />}
                                  </div>
                                  {activity.id !== recentActivity[recentActivity.length - 1].id && (
                                    <div className="absolute left-1/2 top-10 bottom-0 w-0.5 -ml-px bg-border h-full"></div>
                                  )}
                                </div>
                                
                                <div className="flex-1 pb-4">
                                  <div className="flex items-center justify-between">
                                    <p className="font-medium text-sm">{activity.description}</p>
                                    {activity.reward && (
                                      <Badge variant="outline" className="text-green-500 border-green-200 bg-green-50 dark:bg-green-950 dark:border-green-800">
                                        +{activity.reward} ST
                                      </Badge>
                                    )}
                                    {activity.cost && (
                                      <Badge variant="outline" className="text-amber-500 border-amber-200 bg-amber-50 dark:bg-amber-950 dark:border-amber-800">
                                        -{activity.cost} ST
                                      </Badge>
                                    )}
                                  </div>
                                  <div className="flex items-center text-xs text-muted-foreground mt-1">
                                    <Clock className="w-3 h-3 mr-1" />
                                    <span>{new Date(activity.date).toLocaleDateString()}</span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-8">
                            <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                            <h3 className="text-lg font-medium mb-2">No activity yet</h3>
                            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                              Start completing tasks and referring friends to see your activity here.
                            </p>
                            <Link to="/tasks">
                              <Button>
                                <Music2 className="mr-2 h-4 w-4" />
                                Browse Tasks
                              </Button>
                            </Link>
                          </div>
                        )}
                        
                        {recentActivity.length > 0 && (
                          <Button variant="ghost" className="w-full mt-2">
                            <span>View All Activity</span>
                            <ChevronRight className="h-4 w-4 ml-1" />
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                </div>
                
                <motion.div
                  variants={fadeInUp}
                  initial="hidden"
                  animate="visible"
                >
                  <Tabs defaultValue="achievements" className="w-full">
                    <TabsList className="mb-4">
                      <TabsTrigger value="achievements">
                        <Trophy className="w-4 h-4 mr-2" />
                        Achievements
                      </TabsTrigger>
                      <TabsTrigger value="listening">
                        <Music2 className="w-4 h-4 mr-2" />
                        Listening Stats
                      </TabsTrigger>
                      <TabsTrigger value="rewards">
                        <Award className="w-4 h-4 mr-2" />
                        Rewards History
                      </TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="achievements" className="m-0">
                      <Card>
                        <CardHeader>
                          <CardTitle>Your Achievements</CardTitle>
                          <CardDescription>Badges and milestones you've unlocked</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {[
                              { name: 'Early Adopter', icon: Star, unlocked: true, date: new Date(authUser?.created_at || Date.now()).toISOString().split('T')[0] },
                              { name: '5 Day Streak', icon: CalendarDays, unlocked: stats.daysActive >= 5, date: stats.daysActive >= 5 ? '2023-09-15' : null },
                              { name: 'First Referral', icon: User, unlocked: stats.referrals > 0, date: stats.referrals > 0 ? '2023-09-20' : null },
                              { name: 'Music Explorer', icon: Music2, unlocked: stats.tasksCompleted >= 5, date: stats.tasksCompleted >= 5 ? '2023-10-01' : null },
                              { name: '10 Day Streak', icon: CalendarDays, unlocked: stats.daysActive >= 10 },
                              { name: '5 Referrals', icon: User, unlocked: stats.referrals >= 5, date: stats.referrals >= 5 ? '2023-10-28' : null },
                              { name: 'Social Butterfly', icon: User, unlocked: stats.referrals >= 10 },
                              { name: 'Top Listener', icon: Music2, unlocked: stats.tasksCompleted >= 20 },
                            ].map((achievement, index) => (
                              <div 
                                key={index} 
                                className={`border rounded-lg p-3 flex flex-col items-center text-center ${
                                  achievement.unlocked 
                                    ? 'bg-muted/30' 
                                    : 'bg-muted/10 opacity-60'
                                }`}
                              >
                                <div 
                                  className={`h-12 w-12 rounded-full flex items-center justify-center mb-2 ${
                                    achievement.unlocked 
                                      ? 'bg-sound-light/20 text-sound-light' 
                                      : 'bg-muted text-muted-foreground'
                                  }`}
                                >
                                  <achievement.icon className="h-6 w-6" />
                                </div>
                                <h3 className="text-sm font-medium">{achievement.name}</h3>
                                {achievement.unlocked ? (
                                  <span className="text-xs text-muted-foreground mt-1">
                                    {achievement.date ? `Unlocked ${new Date(achievement.date).toLocaleDateString()}` : 'Unlocked'}
                                  </span>
                                ) : (
                                  <span className="text-xs text-muted-foreground mt-1">Locked</span>
                                )}
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                    
                    <TabsContent value="listening" className="m-0">
                      <Card>
                        <CardHeader>
                          <CardTitle>Listening Statistics</CardTitle>
                          <CardDescription>
                            Connect your music accounts to see your listening statistics
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col items-center py-12">
                          <Music2 className="h-12 w-12 text-muted-foreground mb-4" />
                          <h3 className="text-lg font-medium mb-2">No connected accounts</h3>
                          <p className="text-muted-foreground text-center max-w-md mb-6">
                            Connect your Spotify, Apple Music, or other music streaming accounts to see your listening habits and earn rewards.
                          </p>
                          <Button>Connect Music Account</Button>
                        </CardContent>
                      </Card>
                    </TabsContent>
                    
                    <TabsContent value="rewards" className="m-0">
                      <Card>
                        <CardHeader>
                          <CardTitle>Rewards History</CardTitle>
                          <CardDescription>
                            All the rewards you've redeemed
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          {userRewards.length > 0 ? (
                            <div className="space-y-4">
                              {userRewards.map((userReward) => (
                                <div key={userReward.id} className="flex items-center justify-between p-4 border rounded-lg">
                                  <div>
                                    <h3 className="font-medium">{userReward.reward?.name}</h3>
                                    <p className="text-sm text-muted-foreground">
                                      Redeemed on {new Date(userReward.redeemed_at).toLocaleDateString()}
                                    </p>
                                  </div>
                                  <div className="text-right">
                                    <div className="text-sm font-medium">{userReward.points_spent} ST</div>
                                    <Badge variant={userReward.status === 'Fulfilled' ? 'default' : 'outline'}>
                                      {userReward.status}
                                    </Badge>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-center py-8">
                              <Award className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                              <h3 className="text-lg font-medium mb-2">No rewards redeemed yet</h3>
                              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                                Redeem your earned ST for exclusive rewards and benefits. Your redeemed rewards will appear here.
                              </p>
                              <Link to="/rewards">
                                <Button>
                                  <Gift className="mr-2 h-4 w-4" />
                                  Browse Rewards
                                </Button>
                              </Link>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </Tabs>
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

export default Profile;

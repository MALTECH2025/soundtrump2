
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AnimatedTransition } from '@/components/ui/AnimatedTransition';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import TaskCard, { TaskProps } from '@/components/dashboard/TaskCard';
import RankDisplay from '@/components/dashboard/RankDisplay';
import EarningsWidget from '@/components/dashboard/EarningsWidget';
import ReferralWidget from '@/components/dashboard/ReferralWidget';
import { Bell, Music2, Award, TrendingUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/lib/toast';
import { useAuth } from '@/context/AuthContext';
import { useProfile } from '@/context/ProfileContext';

const mockTasks: TaskProps[] = [
  {
    id: '1',
    title: 'Stream Viral Hits playlist for 30 minutes',
    description: 'Connect your Spotify account and stream the Viral Hits playlist for at least 30 minutes.',
    reward: 25,
    category: 'spotify',
    expiresAt: new Date(Date.now() + 86400000 * 2), // 2 days from now
    progress: 0
  },
  {
    id: '2',
    title: 'Share SoundTrump on social media',
    description: 'Create a post about SoundTrump on any social media platform and submit the link.',
    reward: 15,
    category: 'social',
    expiresAt: new Date(Date.now() + 86400000 * 3) // 3 days from now
  },
  {
    id: '3',
    title: 'Refer 3 new users',
    description: 'Get 3 friends to sign up using your referral code.',
    reward: 50,
    category: 'referral',
    expiresAt: new Date(Date.now() + 86400000 * 7) // 7 days from now
  },
  {
    id: '4',
    title: 'Complete a 15-song listening streak',
    description: 'Listen to 15 different songs in a row without skipping.',
    reward: 20,
    category: 'spotify',
    expiresAt: new Date(Date.now() + 86400000), // 1 day from now
    progress: 60
  }
];

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated } = useAuth();
  const { user } = useProfile();
  
  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    // Show welcome toast
    if (user) {
      toast.success(`Welcome back, ${user.name || 'User'}!`, {
        description: 'You have 4 active tasks to complete.',
      });
    }
    
    return () => clearTimeout(timer);
  }, [user]);
  
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
                    <EarningsWidget totalEarnings={3750} pendingEarnings={150} percentageIncrease={12} />
                  </motion.div>
                  <motion.div variants={fadeInUp}>
                    <RankDisplay
                      currentRank={3}
                      rankName="Crystal III"
                      progress={65}
                      nextRankName="Crystal IV"
                      pointsToNextRank={350}
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
                          {mockTasks.map((task) => (
                            <TaskCard key={task.id} task={task} />
                          ))}
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="spotify" className="m-0">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {mockTasks
                            .filter(task => task.category === 'spotify')
                            .map((task) => (
                              <TaskCard key={task.id} task={task} />
                            ))}
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="social" className="m-0">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {mockTasks
                            .filter(task => task.category === 'social')
                            .map((task) => (
                              <TaskCard key={task.id} task={task} />
                            ))}
                        </div>
                      </TabsContent>
                    </Tabs>
                    
                    <div className="mt-8">
                      <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
                      <div className="space-y-4">
                        {[
                          { icon: <Music2 className="w-4 h-4" />, color: 'bg-[#1DB954]/10 text-[#1DB954]', text: 'Completed Spotify streaming task', time: '2 hours ago', amount: '+25 ST Coins' },
                          { icon: <Bell className="w-4 h-4" />, color: 'bg-amber-500/10 text-amber-500', text: 'New task available: Weekend Challenge', time: '6 hours ago', amount: null },
                          { icon: <Award className="w-4 h-4" />, color: 'bg-purple-500/10 text-purple-500', text: 'Ranked up to Crystal III', time: '2 days ago', amount: null },
                          { icon: <TrendingUp className="w-4 h-4" />, color: 'bg-green-500/10 text-green-500', text: 'Earned weekly bonus rewards', time: '3 days ago', amount: '+75 ST Coins' }
                        ].map((activity, index) => (
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
                      totalReferrals={42}
                      influencerThreshold={500}
                      referralCode="SOUNDFAN2024"
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

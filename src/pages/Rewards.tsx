
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { AnimatedTransition } from '@/components/ui/AnimatedTransition';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useAuth } from '@/context/AuthContext';
import { Gift, Coins, CheckCircle2, ArrowRight } from 'lucide-react';
import { toast } from '@/lib/toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchRewards, fetchUserRewards, redeemReward } from '@/lib/api/rewards';
import { useNavigate } from 'react-router-dom';

const Rewards = () => {
  const { isAuthenticated, user: authUser, profile } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const { data: rewards = [], isLoading: rewardsLoading } = useQuery({
    queryKey: ['rewards'],
    queryFn: fetchRewards,
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
  
  const { data: userRewards = [], isLoading: userRewardsLoading } = useQuery({
    queryKey: ['userRewards', authUser?.id],
    queryFn: () => fetchUserRewards(authUser?.id || ''),
    enabled: isAuthenticated && !!authUser?.id,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });

  const redeemMutation = useMutation({
    mutationFn: redeemReward,
    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: ['rewards'] });
        queryClient.invalidateQueries({ queryKey: ['userRewards'] });
        queryClient.invalidateQueries({ queryKey: ['userProfile'] });
        queryClient.invalidateQueries({ queryKey: ['profile'] });
        toast.success(data.message || 'Reward redeemed successfully!');
      } else {
        toast.error(data.message || 'Failed to redeem reward');
      }
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to redeem reward');
    }
  });
  
  const handleRedeemReward = (reward: any) => {
    if (!authUser) {
      toast.error("Please log in to redeem rewards");
      return;
    }

    if ((profile?.points || 0) < reward.points_cost) {
      toast.error(`You need ${reward.points_cost - (profile?.points || 0)} more ST to redeem this reward`);
      return;
    }
    
    redeemMutation.mutate(reward.id);
  };

  const handleEarnMoreST = () => {
    navigate('/tasks');
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
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

  if (!isAuthenticated) {
    return (
      <AnimatedTransition>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-grow pt-24 pb-12 flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-2xl font-bold mb-4">Please log in to view rewards</h1>
              <p className="text-muted-foreground">Sign in to your account to access the rewards store.</p>
            </div>
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
          <div className="container px-4 mx-auto">
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              className="mb-6"
            >
              <h1 className="text-3xl font-bold mb-2">Rewards Store</h1>
              <p className="text-muted-foreground">
                Redeem your earned ST for exclusive music rewards and benefits
              </p>
            </motion.div>
            
            {/* ST balance card */}
            <motion.div 
              variants={fadeInUp} 
              initial="hidden" 
              animate="visible"
              className="mb-8"
            >
              <Card className="bg-gradient-to-r from-sound-dark to-sound-medium overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                    <div className="mb-4 md:mb-0">
                      <div className="flex items-center mb-2">
                        <Coins className="w-6 h-6 text-yellow-400 mr-2" />
                        <h2 className="text-xl font-semibold text-white">SoundTrump Balance</h2>
                      </div>
                      <div className="flex items-baseline">
                        <span className="text-3xl font-bold text-white">{profile?.points || 0}</span>
                        <span className="text-sm ml-2 text-white/80">ST available</span>
                      </div>
                      <p className="text-sm text-white/60 mt-1">
                        Complete tasks and refer friends to earn more ST
                      </p>
                    </div>
                    
                    <Button 
                      className="bg-white/20 hover:bg-white/30 text-white" 
                      size="sm"
                      onClick={handleEarnMoreST}
                    >
                      <ArrowRight className="w-4 h-4 mr-1" />
                      Earn More ST
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            
            {/* Rewards section */}
            <div className="mb-8">
              <Tabs defaultValue="available" className="w-full">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">Rewards</h2>
                  <TabsList>
                    <TabsTrigger value="available">Available</TabsTrigger>
                    <TabsTrigger value="redeemed">My Rewards</TabsTrigger>
                  </TabsList>
                </div>
                
                <TabsContent value="available" className="m-0">
                  {rewardsLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="h-64 bg-muted rounded-lg animate-pulse"></div>
                      ))}
                    </div>
                  ) : (
                    <motion.div 
                      variants={staggerContainer} 
                      initial="hidden" 
                      animate="visible" 
                      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                      {rewards.length > 0 ? (
                        rewards.map((reward: any) => (
                          <motion.div key={reward.id} variants={fadeInUp}>
                            <Card className="h-full flex flex-col overflow-hidden hover:shadow-md transition-shadow">
                              <div className="aspect-video bg-muted relative">
                                <img
                                  src={reward.image_url || '/placeholder.svg'}
                                  alt={reward.name}
                                  className="w-full h-full object-cover"
                                  loading="lazy"
                                />
                                
                                <Badge 
                                  className="absolute top-3 right-3 bg-sound-light"
                                  variant="default"
                                >
                                  {reward.points_cost} ST
                                </Badge>
                                
                                {reward.quantity !== null && reward.quantity <= 10 && reward.quantity > 0 && (
                                  <Badge 
                                    className="absolute top-3 left-3 bg-red-500"
                                    variant="destructive"
                                  >
                                    Only {reward.quantity} left!
                                  </Badge>
                                )}
                                
                                {reward.quantity === 0 && (
                                  <Badge 
                                    className="absolute top-3 left-3 bg-gray-500"
                                  >
                                    Sold Out
                                  </Badge>
                                )}
                              </div>
                              
                              <CardHeader className="pb-2">
                                <CardTitle className="text-lg">{reward.name}</CardTitle>
                                <CardDescription>{reward.description}</CardDescription>
                              </CardHeader>
                              
                              <CardFooter className="mt-auto pt-0">
                                <Button 
                                  className="w-full" 
                                  onClick={() => handleRedeemReward(reward)}
                                  disabled={
                                    !authUser || 
                                    (profile?.points || 0) < reward.points_cost || 
                                    reward.quantity === 0 ||
                                    redeemMutation.isPending
                                  }
                                >
                                  {reward.quantity === 0 ? (
                                    'Sold Out'
                                  ) : !authUser ? (
                                    'Login to Redeem'
                                  ) : (profile?.points || 0) >= reward.points_cost ? (
                                    redeemMutation.isPending ? (
                                      <>
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Redeeming...
                                      </>
                                    ) : (
                                      <>
                                        <Gift className="w-4 h-4 mr-2" />
                                        Redeem Reward
                                      </>
                                    )
                                  ) : (
                                    <>
                                      <Coins className="w-4 h-4 mr-2" />
                                      Need {reward.points_cost - (profile?.points || 0)} More ST
                                    </>
                                  )}
                                </Button>
                              </CardFooter>
                            </Card>
                          </motion.div>
                        ))
                      ) : (
                        <div className="col-span-full text-center py-12">
                          <Gift className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                          <h3 className="text-lg font-medium mb-2">No rewards available</h3>
                          <p className="text-muted-foreground">
                            Check back later for new rewards!
                          </p>
                        </div>
                      )}
                    </motion.div>
                  )}
                </TabsContent>
                
                <TabsContent value="redeemed" className="m-0">
                  {userRewardsLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {[1, 2].map((i) => (
                        <div key={i} className="h-32 bg-muted rounded-lg animate-pulse"></div>
                      ))}
                    </div>
                  ) : userRewards.length === 0 ? (
                    <div className="text-center py-12">
                      <Gift className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium mb-2">No rewards redeemed yet</h3>
                      <p className="text-muted-foreground mb-4">
                        Redeem your ST for exclusive rewards and they will appear here
                      </p>
                    </div>
                  ) : (
                    <motion.div 
                      variants={staggerContainer} 
                      initial="hidden" 
                      animate="visible" 
                      className="grid grid-cols-1 md:grid-cols-2 gap-6"
                    >
                      {userRewards.map((userReward: any) => (
                        <motion.div key={userReward.id} variants={fadeInUp}>
                          <Card className="overflow-hidden">
                            <div className="flex flex-col md:flex-row">
                              <div className="md:w-1/3 aspect-square md:aspect-auto bg-muted">
                                <img
                                  src={userReward.reward?.image_url || '/placeholder.svg'}
                                  alt={userReward.reward?.name}
                                  className="w-full h-full object-cover"
                                  loading="lazy"
                                />
                              </div>
                              
                              <div className="md:w-2/3 p-4">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <h3 className="font-medium">{userReward.reward?.name}</h3>
                                    <p className="text-sm text-muted-foreground">
                                      {userReward.reward?.description}
                                    </p>
                                  </div>
                                  
                                  <Badge variant={userReward.status === 'Fulfilled' ? 'default' : 'outline'}>
                                    {userReward.status}
                                  </Badge>
                                </div>
                                
                                <div className="mt-4 text-xs text-muted-foreground">
                                  <div className="flex items-center mb-1">
                                    <CheckCircle2 className="w-3 h-3 mr-1" />
                                    <span>Redeemed on {new Date(userReward.redeemed_at).toLocaleDateString()}</span>
                                  </div>
                                  <div className="flex items-center">
                                    <Coins className="w-3 h-3 mr-1" />
                                    <span>Cost: {userReward.points_spent} ST</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </Card>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    </AnimatedTransition>
  );
};

export default Rewards;


import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { AnimatedTransition } from '@/components/ui/AnimatedTransition';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { toast } from '@/lib/toast';
import { AlertTriangle, Copy, UserPlus, Share, Users } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useProfile } from '@/context/ProfileContext';
import { fetchUserReferrals, fetchReferralCode, applyReferralCode } from '@/lib/api';
import { supabase } from '@/integrations/supabase/client';

const Referrals = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [referralInput, setReferralInput] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const { isAuthenticated, user: authUser } = useAuth();
  const { user } = useProfile();
  
  const { data: referrals = [], isLoading: referralsLoading, refetch: refetchReferrals } = useQuery({
    queryKey: ['referrals', authUser?.id],
    queryFn: () => fetchUserReferrals(authUser?.id || ''),
    enabled: isAuthenticated && !!authUser?.id,
  });
  
  const { data: referralCode = '', isLoading: codeLoading, refetch: refetchReferralCode } = useQuery({
    queryKey: ['referralCode', authUser?.id],
    queryFn: () => fetchReferralCode(authUser?.id || ''),
    enabled: isAuthenticated && !!authUser?.id,
  });
  
  // Set up realtime subscription for referrals
  useEffect(() => {
    if (!isAuthenticated || !authUser?.id) return;
    
    const referralsChannel = supabase
      .channel('public:referred_users')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'referred_users', filter: `referrer_id=eq.${authUser.id}` }, 
        () => {
          refetchReferrals();
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(referralsChannel);
    };
  }, [isAuthenticated, authUser?.id, refetchReferrals]);
  
  useEffect(() => {
    if (referralsLoading || codeLoading) {
      setIsLoading(true);
    } else {
      // Simulate loading for a smoother UX
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [referralsLoading, codeLoading]);
  
  const handleCopyCode = () => {
    if (referralCode) {
      navigator.clipboard.writeText(referralCode);
      setIsCopied(true);
      toast.success('Referral code copied to clipboard!');
      
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    }
  };
  
  const handleShareCode = () => {
    if (navigator.share && referralCode) {
      navigator.share({
        title: 'Join me on SoundTrump',
        text: `Use my referral code ${referralCode} to join SoundTrump and get bonus points!`,
        url: window.location.origin
      }).then(() => {
        toast.success('Thanks for sharing!');
      }).catch((error) => {
        console.error('Error sharing:', error);
      });
    } else {
      handleCopyCode();
    }
  };
  
  const handleApplyCode = async () => {
    if (!referralInput.trim()) {
      toast.error('Please enter a referral code');
      return;
    }
    
    try {
      const result = await applyReferralCode(referralInput.trim());
      
      if (result.success) {
        toast.success(result.message);
        setReferralInput('');
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error('Error applying referral code:', error);
      toast.error('Failed to apply referral code. Please try again.');
    }
  };
  
  // Calculate progress towards influencer status (500 referrals)
  const influencerThreshold = 500;
  const referralCount = referrals.length;
  const referralProgress = Math.min((referralCount / influencerThreshold) * 100, 100);
  const isInfluencer = user?.role?.status === "Influencer";
  
  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
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
  
  return (
    <AnimatedTransition>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        
        <main className="flex-grow pt-24 pb-12">
          <div className="container px-4 mx-auto max-w-6xl">
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              className="mb-6"
            >
              <h1 className="text-3xl font-bold mb-2">Referrals</h1>
              <p className="text-muted-foreground">Invite friends and earn rewards</p>
            </motion.div>
            
            {isLoading ? (
              <div className="animate-pulse space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="h-48 bg-muted rounded-lg"></div>
                  <div className="md:col-span-2 h-48 bg-muted rounded-lg"></div>
                </div>
                <div className="h-64 bg-muted rounded-lg"></div>
              </div>
            ) : (
              <>
                <motion.div
                  variants={fadeInUp}
                  initial="hidden"
                  animate="visible"
                  className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6"
                >
                  <Card>
                    <CardHeader>
                      <CardTitle>Your Referral Code</CardTitle>
                      <CardDescription>Share this code with friends</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex">
                        <Input 
                          value={referralCode}
                          readOnly 
                          className="font-medium text-center mr-2"
                        />
                        <Button onClick={handleCopyCode} size="icon" variant="outline">
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <Button 
                          variant="outline" 
                          className="w-full"
                          onClick={handleCopyCode}
                        >
                          <Copy className="h-4 w-4 mr-2" />
                          Copy
                        </Button>
                        <Button 
                          className="w-full"
                          onClick={handleShareCode}
                        >
                          <Share className="h-4 w-4 mr-2" />
                          Share
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="md:col-span-2">
                    <CardHeader>
                      <CardTitle>Your Status</CardTitle>
                      <CardDescription>
                        {isInfluencer 
                          ? 'You are an Influencer! Enjoy higher referral bonuses' 
                          : 'Refer more friends to unlock Influencer status'}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-12 h-12 rounded-full bg-sound-accent/10 flex items-center justify-center mr-3">
                            <Users className="w-6 h-6 text-sound-accent" />
                          </div>
                          <div>
                            <div className="text-2xl font-bold">{referralCount}</div>
                            <div className="text-sm text-muted-foreground">Total Referrals</div>
                          </div>
                        </div>
                        
                        {isInfluencer ? (
                          <Badge className="bg-purple-500">Influencer</Badge>
                        ) : (
                          <div className="text-right">
                            <div className="text-sm text-muted-foreground mb-1">
                              {influencerThreshold - referralCount} until Influencer
                            </div>
                            <Progress value={referralProgress} className="w-32 h-2" />
                          </div>
                        )}
                      </div>
                      
                      <div className="p-3 bg-sound-accent/5 rounded-md border border-sound-accent/20 text-sm">
                        <p className="flex items-start">
                          <span className="mr-2 mt-0.5 text-sound-accent">
                            <AlertTriangle className="h-4 w-4" />
                          </span>
                          <span>
                            Earn {isInfluencer ? '20' : '10'} ST Coins for each friend that joins using your code!
                            {!isInfluencer && (
                              <span className="block mt-1">
                                Reach {influencerThreshold} referrals to unlock Influencer status and 2x rewards.
                              </span>
                            )}
                          </span>
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
                
                <motion.div
                  variants={fadeInUp}
                  initial="hidden"
                  animate="visible"
                  className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6"
                >
                  <Card>
                    <CardHeader>
                      <CardTitle>Apply a Referral Code</CardTitle>
                      <CardDescription>Enter someone's referral code</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex space-x-2">
                        <Input 
                          placeholder="Enter referral code" 
                          value={referralInput}
                          onChange={(e) => setReferralInput(e.target.value)}
                        />
                        <Button onClick={handleApplyCode}>Apply</Button>
                      </div>
                      
                      <div className="text-sm text-muted-foreground">
                        <p>You can only apply a referral code once.</p>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="lg:col-span-2">
                    <CardHeader>
                      <CardTitle>Your Referrals</CardTitle>
                      <CardDescription>People who have used your code</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Tabs defaultValue="all">
                        <TabsList className="mb-4">
                          <TabsTrigger value="all">All Referrals</TabsTrigger>
                          <TabsTrigger value="recent">Recent</TabsTrigger>
                        </TabsList>
                        
                        <TabsContent value="all">
                          {referrals.length > 0 ? (
                            <motion.div
                              variants={staggerContainer}
                              initial="hidden"
                              animate="visible"
                              className="space-y-2 max-h-[300px] overflow-y-auto pr-2"
                            >
                              {referrals.map((referral, index) => (
                                <motion.div
                                  key={referral.id}
                                  variants={fadeInUp}
                                  className="flex items-center p-3 rounded-lg border border-border"
                                >
                                  <Avatar className="h-10 w-10 mr-3">
                                    <AvatarImage src={referral.referred_user?.avatar_url} />
                                    <AvatarFallback className="bg-sound-light text-white">
                                      {referral.referred_user?.initials || 'U'}
                                    </AvatarFallback>
                                  </Avatar>
                                  
                                  <div className="flex-1">
                                    <div className="font-medium">
                                      {referral.referred_user?.full_name || referral.referred_user?.username || 'User'}
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                      Joined {new Date(referral.created_at).toLocaleDateString()}
                                    </div>
                                  </div>
                                  
                                  {referral.points_awarded && (
                                    <div className="text-sound-light font-medium">
                                      +{isInfluencer ? '20' : '10'}
                                    </div>
                                  )}
                                </motion.div>
                              ))}
                            </motion.div>
                          ) : (
                            <div className="text-center py-8">
                              <UserPlus className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                              <h3 className="text-lg font-medium mb-1">No referrals yet</h3>
                              <p className="text-muted-foreground">
                                Share your referral code to start earning rewards
                              </p>
                            </div>
                          )}
                        </TabsContent>
                        
                        <TabsContent value="recent">
                          {referrals.length > 0 ? (
                            <motion.div
                              variants={staggerContainer}
                              initial="hidden"
                              animate="visible"
                              className="space-y-2 max-h-[300px] overflow-y-auto pr-2"
                            >
                              {referrals.slice(0, 5).map((referral, index) => (
                                <motion.div
                                  key={referral.id}
                                  variants={fadeInUp}
                                  className="flex items-center p-3 rounded-lg border border-border"
                                >
                                  <Avatar className="h-10 w-10 mr-3">
                                    <AvatarImage src={referral.referred_user?.avatar_url} />
                                    <AvatarFallback className="bg-sound-light text-white">
                                      {referral.referred_user?.initials || 'U'}
                                    </AvatarFallback>
                                  </Avatar>
                                  
                                  <div className="flex-1">
                                    <div className="font-medium">
                                      {referral.referred_user?.full_name || referral.referred_user?.username || 'User'}
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                      Joined {new Date(referral.created_at).toLocaleDateString()}
                                    </div>
                                  </div>
                                  
                                  {referral.points_awarded && (
                                    <div className="text-sound-light font-medium">
                                      +{isInfluencer ? '20' : '10'}
                                    </div>
                                  )}
                                </motion.div>
                              ))}
                            </motion.div>
                          ) : (
                            <div className="text-center py-8">
                              <UserPlus className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                              <h3 className="text-lg font-medium mb-1">No referrals yet</h3>
                              <p className="text-muted-foreground">
                                Share your referral code to start earning rewards
                              </p>
                            </div>
                          )}
                        </TabsContent>
                      </Tabs>
                    </CardContent>
                  </Card>
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

export default Referrals;

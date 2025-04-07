
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from '@/lib/toast';
import { useAuth } from '@/context/AuthContext';
import { useProfile } from '@/context/ProfileContext';
import { fetchReferrals, fetchReferralCode, applyReferralCode } from '@/lib/api';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { AnimatedTransition } from '@/components/ui/AnimatedTransition';

const Referrals = () => {
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const [isCodeCopied, setIsCodeCopied] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [applyCode, setApplyCode] = useState('');
  const { isAuthenticated, user: authUser } = useAuth();
  const { user } = useProfile();
  
  const referralRewardAmount = 10;

  const { data: referrals = [], refetch } = useQuery({
    queryKey: ['referrals', authUser?.id],
    queryFn: () => fetchReferrals(authUser?.id || ''),
    enabled: isAuthenticated && !!authUser?.id,
  });

  const { data: fetchedReferralCode } = useQuery({
    queryKey: ['referralCode', authUser?.id],
    queryFn: () => fetchReferralCode(authUser?.id || ''),
    enabled: isAuthenticated && !!authUser?.id,
  });

  useEffect(() => {
    if (fetchedReferralCode) {
      setReferralCode(fetchedReferralCode);
    }
  }, [fetchedReferralCode]);

  const handleCopyCode = () => {
    if (referralCode) {
      navigator.clipboard.writeText(referralCode);
      setIsCodeCopied(true);
      toast.success('Referral code copied to clipboard!');
      setTimeout(() => setIsCodeCopied(false), 2000);
    }
  };

  const handleApplyReferralCode = async () => {
    setIsApplying(true);
    try {
      const result = await applyReferralCode(applyCode);
      if (result.success) {
        toast.success(result.message);
        refetch();
      } else {
        toast.error(result.message || 'Failed to apply referral code.');
      }
    } catch (error: any) {
      toast.error(error.message || 'An unexpected error occurred.');
    } finally {
      setIsApplying(false);
    }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <AnimatedTransition>
      <div className="min-h-screen flex flex-col">
        <Navbar userProfile={user} />
        
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          className="container mx-auto py-12 px-4 md:px-6 pt-24 pb-16 flex-grow"
        >
          <div className="grid gap-6">
            <Card className="border">
              <CardHeader>
                <CardTitle className="text-2xl font-bold">Referral Program</CardTitle>
                <CardDescription>Share your referral code with friends and earn rewards!</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-4">
                  <div>
                    <Label htmlFor="referralCode">Your Referral Code</Label>
                    <div className="flex items-center mt-2">
                      <Input
                        id="referralCode"
                        className="mr-2"
                        value={referralCode || 'Loading...'}
                        readOnly
                      />
                      <Button size="sm" onClick={handleCopyCode} disabled={isCodeCopied}>
                        {isCodeCopied ? 'Copied!' : 'Copy'}
                      </Button>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="applyReferralCode">Apply Referral Code</Label>
                    <div className="flex items-center mt-2">
                      <Input
                        id="applyReferralCode"
                        className="mr-2"
                        placeholder="Enter referral code"
                        value={applyCode}
                        onChange={(e) => setApplyCode(e.target.value)}
                      />
                      <Button size="sm" onClick={handleApplyReferralCode} disabled={isApplying}>
                        {isApplying ? 'Applying...' : 'Apply'}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border">
              <CardHeader>
                <CardTitle className="text-xl font-bold">Referral Records</CardTitle>
                <CardDescription>See who you've referred and your rewards.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="hidden md:block">
                  {referrals && referrals.length > 0 ? (
                    <div className="space-y-4">
                      {referrals.map((referral: any) => (
                        <div key={referral.id} className="flex items-center justify-between p-4 bg-card rounded-lg border">
                          <div className="flex items-center">
                            <Avatar className="h-10 w-10 mr-3">
                              {referral.profiles?.avatar_url ? (
                                <AvatarImage src={referral.profiles.avatar_url} alt="User avatar" />
                              ) : (
                                <AvatarFallback>{referral.profiles?.initials || "U"}</AvatarFallback>
                              )}
                            </Avatar>
                            <div>
                              <div className="font-medium">
                                {referral.profiles?.full_name || referral.profiles?.username || "Anonymous User"}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                Joined {new Date(referral.created_at).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                          <div className="text-sm font-medium text-sound-light">
                            +{referralRewardAmount} ST Coins
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <p className="text-muted-foreground">No referrals yet. Share your code and start earning!</p>
                    </div>
                  )}
                </div>

                <div className="md:hidden">
                  {referrals && referrals.length > 0 ? (
                    <div className="space-y-4">
                      {referrals.map((referral: any) => (
                        <div key={referral.id} className="flex items-center justify-between p-4 bg-card rounded-lg border">
                          <div className="flex items-center">
                            <Avatar className="h-10 w-10 mr-3">
                              {referral.profiles?.avatar_url ? (
                                <AvatarImage src={referral.profiles.avatar_url} alt="User avatar" />
                              ) : (
                                <AvatarFallback>{referral.profiles?.initials || "U"}</AvatarFallback>
                              )}
                            </Avatar>
                            <div>
                              <div className="font-medium">
                                {referral.profiles?.full_name || referral.profiles?.username || "Anonymous User"}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                Joined {new Date(referral.created_at).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                          <div className="text-sm font-medium text-sound-light">
                            +{referralRewardAmount} ST Coins
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <p className="text-muted-foreground">No referrals yet. Share your code and start earning!</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
        
        <Footer />
      </div>
    </AnimatedTransition>
  );
};

export default Referrals;

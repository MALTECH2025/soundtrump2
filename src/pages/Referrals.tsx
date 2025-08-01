
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Users, Share2, Gift, Copy, Check, Crown, Star, Plus } from 'lucide-react';
import { AnimatedTransition } from '@/components/ui/AnimatedTransition';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/lib/toast';
import { 
  fetchUserReferrals, 
  fetchReferredUsers, 
  createReferralCode, 
  getReferralStats,
  applyReferralCode
} from '@/lib/api/referrals';

const Referrals = () => {
  const [copied, setCopied] = useState(false);
  const [referralCodeInput, setReferralCodeInput] = useState('');
  const { isAuthenticated, user: authUser } = useAuth();
  const queryClient = useQueryClient();

  const { data: referralData } = useQuery({
    queryKey: ['userReferrals', authUser?.id],
    queryFn: () => fetchUserReferrals(authUser?.id || ''),
    enabled: isAuthenticated && !!authUser?.id,
  });

  const { data: referredUsers = [] } = useQuery({
    queryKey: ['referredUsers', authUser?.id],
    queryFn: () => fetchReferredUsers(authUser?.id || ''),
    enabled: isAuthenticated && !!authUser?.id,
  });

  const { data: referralStats } = useQuery({
    queryKey: ['referralStats', authUser?.id],
    queryFn: () => getReferralStats(authUser?.id || ''),
    enabled: isAuthenticated && !!authUser?.id,
  });

  const createReferralMutation = useMutation({
    mutationFn: () => createReferralCode(authUser?.id || ''),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userReferrals'] });
      toast.success('Referral code created successfully!');
    },
    onError: (error: any) => {
      console.error('Create referral error:', error);
      toast.error(error.message || 'Failed to create referral code');
    }
  });

  const applyReferralMutation = useMutation({
    mutationFn: (code: string) => applyReferralCode(code),
    onSuccess: (result) => {
      console.log('Apply referral success:', result);
      toast.success(result.message || 'Referral code applied successfully!', {
        description: `You earned ${result.points_earned || 10} ST Coins!`
      });
      setReferralCodeInput('');
      
      // Refresh all data
      queryClient.invalidateQueries({ queryKey: ['userReferrals'] });
      queryClient.invalidateQueries({ queryKey: ['referredUsers'] });
      queryClient.invalidateQueries({ queryKey: ['referralStats'] });
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
    onError: (error: any) => {
      console.error('Apply referral error:', error);
      toast.error(error.message || 'Failed to apply referral code');
    }
  });

  const handleApplyReferralCode = () => {
    const trimmedCode = referralCodeInput.trim().toUpperCase();
    if (!trimmedCode) {
      toast.error('Please enter a referral code');
      return;
    }
    
    applyReferralMutation.mutate(trimmedCode);
  };

  const referralCode = referralData?.referral_code || '';
  const referralLink = `${window.location.origin}/?ref=${referralCode}`;

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success('Copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('Failed to copy to clipboard');
    }
  };

  const shareReferralLink = () => {
    if (navigator.share && referralLink) {
      navigator.share({
        title: 'Join SoundTrump!',
        text: 'Join me on SoundTrump and earn crypto rewards by completing simple tasks!',
        url: referralLink,
      });
    } else {
      copyToClipboard(referralLink);
    }
  };

  if (!isAuthenticated) {
    return (
      <AnimatedTransition>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-grow pt-24 pb-12 flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-2xl font-bold mb-4 text-foreground">Please log in to access referrals</h1>
              <p className="text-muted-foreground">Sign in to your account to start earning referral rewards.</p>
            </div>
          </main>
          <Footer />
        </div>
      </AnimatedTransition>
    );
  }

  return (
    <AnimatedTransition>
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        
        <main className="flex-grow pt-24 pb-12">
          <div className="container px-4 mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-6"
            >
              <h1 className="text-3xl font-bold mb-2 flex items-center gap-2 text-foreground">
                <Users className="w-8 h-8 text-primary" />
                Referral Program
              </h1>
              <p className="text-muted-foreground">Invite friends and earn rewards together!</p>
            </motion.div>

            {/* Apply Referral Code Section */}
            <Card className="mb-6 bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-card-foreground">
                  <Plus className="w-5 h-5" />
                  Have a Referral Code?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter referral code (e.g., ST12345678)"
                    value={referralCodeInput}
                    onChange={(e) => setReferralCodeInput(e.target.value.toUpperCase())}
                    className="flex-1 bg-background border-input text-foreground"
                  />
                  <Button 
                    onClick={handleApplyReferralCode}
                    disabled={applyReferralMutation.isPending}
                  >
                    {applyReferralMutation.isPending ? 'Applying...' : 'Apply Code'}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Apply a friend's referral code to earn bonus points for both of you!
                </p>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              {/* Stats Cards */}
              <Card className="bg-card border-border">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-card-foreground">Total Referrals</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">{referralStats?.totalReferrals || 0}</div>
                  <p className="text-xs text-muted-foreground">Friends joined</p>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-card-foreground">Points Earned</CardTitle>
                  <Gift className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">{referralStats?.pointsEarned || 0}</div>
                  <p className="text-xs text-muted-foreground">ST Coins from referrals</p>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-card-foreground">Pending</CardTitle>
                  <Star className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">{referralStats?.pendingReferrals || 0}</div>
                  <p className="text-xs text-muted-foreground">Awaiting completion</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Referral Link Section */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-card-foreground">
                    <Share2 className="w-5 h-5" />
                    Your Referral Link
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {!referralCode ? (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground mb-4">You don't have a referral code yet.</p>
                      <Button 
                        onClick={() => createReferralMutation.mutate()}
                        disabled={createReferralMutation.isPending}
                      >
                        {createReferralMutation.isPending ? 'Creating...' : 'Create Referral Code'}
                      </Button>
                    </div>
                  ) : (
                    <>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Referral Code</label>
                        <div className="flex gap-2">
                          <Input value={referralCode} readOnly className="bg-background border-input text-foreground" />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => copyToClipboard(referralCode)}
                          >
                            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Referral Link</label>
                        <div className="flex gap-2">
                          <Input value={referralLink} readOnly className="text-xs bg-background border-input text-foreground" />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => copyToClipboard(referralLink)}
                          >
                            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                          </Button>
                        </div>
                      </div>

                      <Button onClick={shareReferralLink} className="w-full">
                        <Share2 className="w-4 h-4 mr-2" />
                        Share Referral Link
                      </Button>

                      <div className="bg-primary/10 p-4 rounded-lg border border-primary/20">
                        <h3 className="font-semibold text-primary mb-2">How it works:</h3>
                        <ul className="text-sm text-foreground space-y-1">
                          <li>• Share your referral link with friends</li>
                          <li>• They sign up using your link</li>
                          <li>• You both earn 10 ST Coins!</li>
                          <li>• No limit on referrals</li>
                        </ul>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Referred Users */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-card-foreground">
                    <Crown className="w-5 h-5" />
                    Your Referrals ({referredUsers.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {referredUsers.length === 0 ? (
                    <div className="text-center py-8">
                      <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No referrals yet</p>
                      <p className="text-sm text-muted-foreground">Start sharing your link to see referrals here!</p>
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {referredUsers.map((referral: any) => (
                        <div key={referral.id} className="flex items-center justify-between p-3 bg-muted rounded-lg border border-border">
                          <div className="flex items-center gap-3">
                            <Avatar className="w-10 h-10">
                              <AvatarImage src={referral.referred_user?.avatar_url || ''} />
                              <AvatarFallback className="bg-primary/10 text-primary">
                                {referral.referred_user?.initials || '??'}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-foreground">
                                {referral.referred_user?.username || 
                                 referral.referred_user?.full_name || 
                                 `User ${referral.referred_user_id.slice(0, 8)}`}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Joined {new Date(referral.created_at).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <Badge variant={referral.points_awarded ? "default" : "secondary"}>
                            {referral.points_awarded ? "Rewarded" : "Pending"}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    </AnimatedTransition>
  );
};

export default Referrals;

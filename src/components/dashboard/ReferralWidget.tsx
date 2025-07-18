
import { Users, UserPlus, Share, Award, Copy, Check } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { toast } from '@/lib/toast';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { createReferralCode } from '@/lib/api/referrals';

interface ReferralWidgetProps {
  totalReferrals: number;
  influencerThreshold: number;
  referralCode: string;
  isInfluencer: boolean;
}

const ReferralWidget = ({ 
  totalReferrals = 0, 
  influencerThreshold = 500, 
  referralCode = '', 
  isInfluencer = false 
}: ReferralWidgetProps) => {
  const [isCopied, setIsCopied] = useState(false);
  const [currentReferralCode, setCurrentReferralCode] = useState(referralCode);
  const [isCreating, setIsCreating] = useState(false);
  const { user } = useAuth();
  
  const referralProgress = Math.min((totalReferrals / influencerThreshold) * 100, 100);
  const referralLink = currentReferralCode ? `${window.location.origin}/?ref=${currentReferralCode}` : '';
  
  const handleCreateReferralCode = async () => {
    if (!user?.id) return;
    
    setIsCreating(true);
    try {
      const result = await createReferralCode(user.id);
      setCurrentReferralCode(result.referral_code);
      toast.success('Referral code created successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to create referral code');
    } finally {
      setIsCreating(false);
    }
  };
  
  const handleCopyReferralCode = () => {
    if (!currentReferralCode) {
      toast.error('No referral code available');
      return;
    }
    
    navigator.clipboard.writeText(currentReferralCode);
    setIsCopied(true);
    toast.success('Referral code copied to clipboard!');
    
    setTimeout(() => setIsCopied(false), 2000);
  };
  
  const handleCopyReferralLink = () => {
    if (!referralLink) {
      toast.error('No referral link available');
      return;
    }
    
    navigator.clipboard.writeText(referralLink);
    toast.success('Referral link copied to clipboard!');
  };
  
  const handleShareReferral = () => {
    if (!referralLink) {
      toast.error('No referral link available');
      return;
    }
    
    if (navigator.share) {
      navigator.share({
        title: 'Join SoundTrump!',
        text: 'Join me on SoundTrump and earn crypto rewards by completing simple tasks!',
        url: referralLink,
      });
    } else {
      handleCopyReferralLink();
    }
  };

  // Update local state when prop changes
  useEffect(() => {
    setCurrentReferralCode(referralCode);
  }, [referralCode]);

  return (
    <Card className="border overflow-hidden">
      <CardHeader className="p-5 pb-0">
        <div className="flex justify-between items-center">
          <CardTitle className="text-base font-medium">Referral Program</CardTitle>
          {isInfluencer && (
            <div className="bg-purple-500/10 text-purple-500 px-2 py-0.5 rounded-full text-xs flex items-center">
              <Award className="w-3 h-3 mr-1" />
              <span>Influencer</span>
            </div>
          )}
        </div>
        <CardDescription>
          {isInfluencer 
            ? 'You are an Influencer! Enjoy higher referral bonuses'
            : 'Invite friends and earn bonus rewards'}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-full bg-sound-accent/10 flex items-center justify-center mr-3">
              <Users className="w-6 h-6 text-sound-accent" />
            </div>
            <div>
              <div className="text-2xl font-bold">{totalReferrals}</div>
              <div className="text-xs text-muted-foreground">Total Referrals</div>
            </div>
          </div>
          
          {!isInfluencer && (
            <div>
              <div className="text-xs text-right mb-1 text-muted-foreground">
                {Math.max(0, influencerThreshold - totalReferrals)} until Influencer
              </div>
              <Progress value={referralProgress} className="h-1 w-24" />
            </div>
          )}
        </div>
        
        {currentReferralCode ? (
          <>
            <div className="p-3 rounded-md border border-border bg-muted/20 mb-4">
              <div className="flex justify-between items-center mb-2">
                <div className="text-xs text-muted-foreground">Your referral code</div>
                <motion.div 
                  animate={{ scale: isCopied ? [1, 1.2, 1] : 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-6 text-xs font-mono"
                    onClick={handleCopyReferralCode}
                  >
                    {isCopied ? <Check className="w-3 h-3" /> : currentReferralCode}
                  </Button>
                </motion.div>
              </div>
              
              <div className="text-xs text-muted-foreground break-all">
                Link: {referralLink}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <Button 
                variant="outline" 
                className="w-full text-sm h-9" 
                onClick={handleCopyReferralCode}
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy Code
              </Button>
              <Button 
                variant="default" 
                className="w-full text-sm h-9" 
                onClick={handleShareReferral}
              >
                <Share className="w-4 h-4 mr-2" />
                Share Link
              </Button>
            </div>
          </>
        ) : (
          <div className="text-center py-4">
            <p className="text-sm text-muted-foreground mb-2">No referral code available</p>
            <Button 
              onClick={handleCreateReferralCode}
              disabled={isCreating || !user?.id}
              className="w-full"
            >
              {isCreating ? 'Creating...' : 'Create Referral Code'}
            </Button>
          </div>
        )}
        
        <div className="mt-4 text-xs text-muted-foreground">
          <p>Earn {isInfluencer ? '20' : '10'} ST Coins for each friend that joins using your code!</p>
          {!isInfluencer && (
            <p className="mt-1">Reach {influencerThreshold} referrals to unlock Influencer status and 2x rewards.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ReferralWidget;

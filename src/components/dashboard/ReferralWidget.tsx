
import { Users, UserPlus, Share, Award } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { toast } from '@/lib/toast';
import { motion } from 'framer-motion';
import { useState } from 'react';

interface ReferralWidgetProps {
  totalReferrals: number;
  influencerThreshold: number;
  referralCode: string;
  isInfluencer: boolean;
}

const ReferralWidget = ({ 
  totalReferrals = 42, 
  influencerThreshold = 500, 
  referralCode = 'SOUNDFAN2024', 
  isInfluencer = false 
}: ReferralWidgetProps) => {
  const [isCopied, setIsCopied] = useState(false);
  
  const referralProgress = Math.min((totalReferrals / influencerThreshold) * 100, 100);
  
  const handleCopyReferralCode = () => {
    navigator.clipboard.writeText(referralCode);
    setIsCopied(true);
    toast.success('Referral code copied to clipboard!');
    
    // Reset the copied state after 2 seconds
    setTimeout(() => setIsCopied(false), 2000);
  };
  
  const handleShareReferral = () => {
    // Implementation for sharing would depend on the platforms you want to support
    toast.success('Share dialog would open here');
  };

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
                {influencerThreshold - totalReferrals} until Influencer
              </div>
              <Progress value={referralProgress} className="h-1 w-24" />
            </div>
          )}
        </div>
        
        <div className="p-3 rounded-md border border-border bg-muted/20 mb-4">
          <div className="flex justify-between items-center">
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
                {referralCode}
              </Button>
            </motion.div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <Button 
            variant="outline" 
            className="w-full text-sm h-9" 
            onClick={handleCopyReferralCode}
          >
            <UserPlus className="w-4 h-4 mr-2" />
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

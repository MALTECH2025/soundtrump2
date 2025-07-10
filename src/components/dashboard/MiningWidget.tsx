
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Pickaxe, Zap, Clock } from 'lucide-react';
import { toast } from '@/lib/toast';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';

const MiningWidget = () => {
  const [miningBalance, setMiningBalance] = useState(0);
  const [isCollecting, setIsCollecting] = useState(false);
  const [miningRate] = useState(5); // Changed to 5 ST coins per hour
  const [lastCollected, setLastCollected] = useState<Date | null>(null);
  const { user, profile } = useAuth();
  const queryClient = useQueryClient();

  // Calculate mining progress based on time elapsed
  const calculateMiningProgress = () => {
    if (!lastCollected) {
      // If never collected, start mining from current time
      const now = new Date();
      setLastCollected(now);
      return 0;
    }
    
    const now = new Date();
    const timeDiff = now.getTime() - lastCollected.getTime();
    const hoursElapsed = timeDiff / (1000 * 60 * 60);
    const earnedCoins = Math.floor(hoursElapsed * miningRate);
    
    // No cap, let it accumulate
    return earnedCoins;
  };

  // Initialize mining system
  useEffect(() => {
    if (!user) return;

    // Load last collected time from localStorage for persistence
    const storedLastCollected = localStorage.getItem(`mining_last_collected_${user.id}`);
    if (storedLastCollected) {
      setLastCollected(new Date(storedLastCollected));
    } else {
      // First time user, set current time
      const now = new Date();
      setLastCollected(now);
      localStorage.setItem(`mining_last_collected_${user.id}`, now.toISOString());
    }
  }, [user]);

  // Update mining balance every minute
  useEffect(() => {
    if (!lastCollected) return;

    const updateMiningBalance = () => {
      const newBalance = calculateMiningProgress();
      setMiningBalance(newBalance);
    };

    // Initial calculation
    updateMiningBalance();

    // Update every minute
    const interval = setInterval(updateMiningBalance, 60000);
    
    return () => clearInterval(interval);
  }, [lastCollected, miningRate]);

  const handleCollectMining = async () => {
    if (!user || miningBalance === 0) return;
    
    setIsCollecting(true);
    
    try {
      // Add mining balance to user's points
      const { error } = await supabase
        .from('profiles')
        .update({ 
          points: (profile?.points || 0) + miningBalance 
        })
        .eq('id', user.id);
      
      if (error) throw error;
      
      // Reset mining and update last collected time
      const now = new Date();
      setLastCollected(now);
      setMiningBalance(0);
      
      // Store in localStorage for persistence
      localStorage.setItem(`mining_last_collected_${user.id}`, now.toISOString());
      
      // Refresh user profile data
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      
      toast.success(`Collected ${miningBalance} ST coins from mining!`, {
        description: 'Your mining rewards have been added to your balance.'
      });
      
    } catch (error: any) {
      console.error('Error collecting mining rewards:', error);
      toast.error('Failed to collect mining rewards');
    } finally {
      setIsCollecting(false);
    }
  };

  const getTimeUntilNextReward = () => {
    if (miningBalance >= miningRate) return 'Ready to collect!';
    
    if (!lastCollected) return 'Initializing...';
    
    const now = new Date();
    const timeDiff = now.getTime() - lastCollected.getTime();
    const hoursElapsed = timeDiff / (1000 * 60 * 60);
    const nextRewardHours = Math.ceil(hoursElapsed) - hoursElapsed;
    const minutesToNext = Math.ceil(nextRewardHours * 60);
    
    if (minutesToNext <= 0) return 'Ready to collect!';
    
    const hours = Math.floor(minutesToNext / 60);
    const minutes = minutesToNext % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const getMiningProgress = () => {
    if (miningBalance === 0) return 0;
    // Show progress as percentage of next full hour reward
    const partialProgress = (miningBalance % miningRate) / miningRate * 100;
    return miningBalance >= miningRate ? 100 : partialProgress;
  };

  return (
    <Card className="bg-gradient-to-br from-orange-50 to-yellow-50 border-orange-200">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Pickaxe className="w-5 h-5 text-orange-600" />
          Mining Station
          <Badge variant="secondary" className="ml-auto">Active</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <div className="text-3xl font-bold text-orange-600 mb-1">
            {miningBalance.toFixed(0)} ST
          </div>
          <p className="text-sm text-muted-foreground">Mining Balance</p>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Mining Progress</span>
            <span>{miningBalance.toFixed(0)} ST earned</span>
          </div>
          <Progress value={getMiningProgress()} className="h-2" />
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="bg-white/50 rounded-lg p-3">
            <div className="flex items-center justify-center gap-1 text-orange-600 mb-1">
              <Zap className="w-4 h-4" />
              <span className="text-sm font-medium">{miningRate}/h</span>
            </div>
            <p className="text-xs text-muted-foreground">Mining Rate</p>
          </div>
          
          <div className="bg-white/50 rounded-lg p-3">
            <div className="flex items-center justify-center gap-1 text-blue-600 mb-1">
              <Clock className="w-4 h-4" />
              <span className="text-sm font-medium">{getTimeUntilNextReward()}</span>
            </div>
            <p className="text-xs text-muted-foreground">Next Reward</p>
          </div>
        </div>
        
        <Button 
          onClick={handleCollectMining}
          disabled={miningBalance === 0 || isCollecting}
          className="w-full bg-orange-600 hover:bg-orange-700"
        >
          {isCollecting ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Collecting...
            </>
          ) : (
            <>
              <Pickaxe className="w-4 h-4 mr-2" />
              Collect Rewards ({miningBalance.toFixed(0)} ST)
            </>
          )}
        </Button>
        
        <p className="text-xs text-center text-muted-foreground">
          Mining automatically generates 5 ST coins per hour. Collect anytime to claim your accumulated rewards!
        </p>
      </CardContent>
    </Card>
  );
};

export default MiningWidget;


import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Coins, Clock, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from '@/lib/toast';
import { useProfile } from '@/context/ProfileContext';
import { updateUserProfile } from '@/lib/api';

interface MiningWidgetProps {
  onPointsUpdate?: () => void;
}

const MiningWidget: React.FC<MiningWidgetProps> = ({ onPointsUpdate }) => {
  const { user } = useProfile();
  const [isMining, setIsMining] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [canClaim, setCanClaim] = useState(false);
  const [accumulatedCoins, setAccumulatedCoins] = useState(0);

  const MINING_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds
  const COINS_PER_HOUR = 0.003;

  useEffect(() => {
    // Check if user has an active mining session
    const miningData = localStorage.getItem(`mining_${user?.id}`);
    if (miningData) {
      const { startTime, isActive } = JSON.parse(miningData);
      const elapsed = Date.now() - startTime;
      
      if (isActive && elapsed < MINING_DURATION) {
        setIsMining(true);
        setTimeRemaining(MINING_DURATION - elapsed);
      } else if (isActive && elapsed >= MINING_DURATION) {
        setCanClaim(true);
        setAccumulatedCoins(COINS_PER_HOUR);
        localStorage.setItem(`mining_${user?.id}`, JSON.stringify({
          startTime,
          isActive: false,
          canClaim: true
        }));
      }
    }
  }, [user?.id]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isMining && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => {
          const newTime = prev - 1000;
          if (newTime <= 0) {
            setIsMining(false);
            setCanClaim(true);
            setAccumulatedCoins(COINS_PER_HOUR);
            localStorage.setItem(`mining_${user?.id}`, JSON.stringify({
              startTime: Date.now() - MINING_DURATION,
              isActive: false,
              canClaim: true
            }));
            toast.success('Mining complete! You can now claim your ST coins.');
            return 0;
          }
          return newTime;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isMining, timeRemaining, user?.id]);

  const startMining = () => {
    if (!user) {
      toast.error('You need to be logged in to start mining.');
      return;
    }

    const startTime = Date.now();
    setIsMining(true);
    setTimeRemaining(MINING_DURATION);
    setCanClaim(false);
    setAccumulatedCoins(0);

    localStorage.setItem(`mining_${user.id}`, JSON.stringify({
      startTime,
      isActive: true,
      canClaim: false
    }));

    toast.success('Mining started! Come back in 1 hour to claim your coins.');
  };

  const claimCoins = async () => {
    if (!user || !canClaim) return;

    try {
      const currentPoints = user.points || 0;
      const newPoints = currentPoints + accumulatedCoins;

      await updateUserProfile({ points: newPoints });
      
      setCanClaim(false);
      setAccumulatedCoins(0);
      localStorage.removeItem(`mining_${user.id}`);
      
      toast.success(`Successfully claimed ${accumulatedCoins} ST coins!`);
      
      if (onPointsUpdate) {
        onPointsUpdate();
      }
    } catch (error) {
      console.error('Error claiming coins:', error);
      toast.error('Failed to claim coins. Please try again.');
    }
  };

  const formatTime = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const getProgressPercentage = () => {
    if (!isMining) return 0;
    return ((MINING_DURATION - timeRemaining) / MINING_DURATION) * 100;
  };

  return (
    <Card className="bg-gradient-to-br from-yellow-50 to-amber-50 border-yellow-200">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <Coins className="w-5 h-5 text-yellow-600" />
            ST Coin Mining
          </CardTitle>
          {isMining && (
            <Badge variant="secondary" className="bg-yellow-100 text-yellow-700">
              <Zap className="w-3 h-3 mr-1" />
              Mining
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-yellow-600">
            {accumulatedCoins > 0 ? `+${accumulatedCoins}` : '0.003'} ST
          </div>
          <p className="text-sm text-muted-foreground">Coins per hour</p>
        </div>

        {isMining && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                Time remaining:
              </span>
              <span className="font-mono">{formatTime(timeRemaining)}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                className="bg-yellow-500 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${getProgressPercentage()}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        )}

        <div className="flex gap-2">
          {!isMining && !canClaim && (
            <Button
              onClick={startMining}
              className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white"
            >
              <Zap className="w-4 h-4 mr-2" />
              Start Mining
            </Button>
          )}
          
          {canClaim && (
            <Button
              onClick={claimCoins}
              className="flex-1 bg-green-500 hover:bg-green-600 text-white"
            >
              <Coins className="w-4 h-4 mr-2" />
              Claim {accumulatedCoins} ST
            </Button>
          )}
          
          {isMining && (
            <Button
              disabled
              className="flex-1"
              variant="outline"
            >
              <Clock className="w-4 h-4 mr-2" />
              Mining in Progress...
            </Button>
          )}
        </div>

        <div className="text-xs text-muted-foreground text-center">
          💡 Mining takes 1 hour to complete. You can close the browser and come back later!
        </div>
      </CardContent>
    </Card>
  );
};

export default MiningWidget;

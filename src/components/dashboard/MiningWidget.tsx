
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Coins, Clock, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from '@/lib/toast';
import { useAuth } from '@/context/AuthContext';
import { updateUserProfile, fetchUserProfile } from '@/lib/api';
import { supabase } from '@/integrations/supabase/client';

interface MiningSession {
  startTime: number;
  isActive: boolean;
  canClaim: boolean;
  accumulatedCoins: number;
}

interface MiningWidgetProps {
  onPointsUpdate?: () => void;
}

const MiningWidget: React.FC<MiningWidgetProps> = ({ onPointsUpdate }) => {
  const { user, updateUserProfile: updateAuthProfile } = useAuth();
  const [isMining, setIsMining] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [canClaim, setCanClaim] = useState(false);
  const [accumulatedCoins, setAccumulatedCoins] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const MINING_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds
  const COINS_PER_HOUR = 0.003;

  // Load mining session from database on component mount
  useEffect(() => {
    loadMiningSession();
  }, [user?.id]);

  // Set up real-time subscription for user profile updates
  useEffect(() => {
    if (!user?.id) return;

    const channel = supabase
      .channel('user-profile-updates')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'profiles',
          filter: `id=eq.${user.id}`
        },
        (payload) => {
          console.log('Profile updated:', payload);
          if (onPointsUpdate) {
            onPointsUpdate();
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id, onPointsUpdate]);

  // Mining countdown timer
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
            saveMiningSession({
              startTime: Date.now() - MINING_DURATION,
              isActive: false,
              canClaim: true,
              accumulatedCoins: COINS_PER_HOUR
            });
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
  }, [isMining, timeRemaining]);

  const loadMiningSession = async () => {
    if (!user?.id) return;

    try {
      // Try to get mining session from localStorage first for immediate feedback
      const localSession = localStorage.getItem(`mining_${user.id}`);
      if (localSession) {
        const session: MiningSession = JSON.parse(localSession);
        const elapsed = Date.now() - session.startTime;
        
        if (session.isActive && elapsed < MINING_DURATION) {
          setIsMining(true);
          setTimeRemaining(MINING_DURATION - elapsed);
        } else if (session.isActive && elapsed >= MINING_DURATION) {
          setCanClaim(true);
          setAccumulatedCoins(COINS_PER_HOUR);
          localStorage.setItem(`mining_${user.id}`, JSON.stringify({
            ...session,
            isActive: false,
            canClaim: true,
            accumulatedCoins: COINS_PER_HOUR
          }));
        } else if (session.canClaim) {
          setCanClaim(true);
          setAccumulatedCoins(session.accumulatedCoins);
        }
      }
    } catch (error) {
      console.error('Error loading mining session:', error);
    }
  };

  const saveMiningSession = (session: MiningSession) => {
    if (!user?.id) return;
    localStorage.setItem(`mining_${user.id}`, JSON.stringify(session));
  };

  const startMining = async () => {
    if (!user) {
      toast.error('You need to be logged in to start mining.');
      return;
    }

    setIsLoading(true);
    try {
      const startTime = Date.now();
      const session: MiningSession = {
        startTime,
        isActive: true,
        canClaim: false,
        accumulatedCoins: 0
      };

      setIsMining(true);
      setTimeRemaining(MINING_DURATION);
      setCanClaim(false);
      setAccumulatedCoins(0);

      saveMiningSession(session);
      toast.success('Mining started! Come back in 1 hour to claim your coins.');
    } catch (error) {
      console.error('Error starting mining:', error);
      toast.error('Failed to start mining. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const claimCoins = async () => {
    if (!user || !canClaim) return;

    setIsLoading(true);
    try {
      // Get current user profile to ensure we have the latest points
      const currentProfile = await fetchUserProfile(user.id);
      const currentPoints = currentProfile.points || 0;
      const newPoints = currentPoints + accumulatedCoins;

      // Update user points in the database
      await updateUserProfile({ points: newPoints });
      
      // Update local auth context
      await updateAuthProfile({ points: newPoints });
      
      // Clear mining session
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
    } finally {
      setIsLoading(false);
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
              disabled={isLoading}
              className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white"
            >
              <Zap className="w-4 h-4 mr-2" />
              {isLoading ? 'Starting...' : 'Start Mining'}
            </Button>
          )}
          
          {canClaim && (
            <Button
              onClick={claimCoins}
              disabled={isLoading}
              className="flex-1 bg-green-500 hover:bg-green-600 text-white"
            >
              <Coins className="w-4 h-4 mr-2" />
              {isLoading ? 'Claiming...' : `Claim ${accumulatedCoins} ST`}
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

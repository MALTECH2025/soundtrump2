
import { useState } from 'react';
import { Diamond, Trophy, ChevronRight, Info } from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from '@/components/ui/tooltip';
import { Progress } from '@/components/ui/progress';
import { motion } from 'framer-motion';

interface RankDisplayProps {
  currentRank: number;
  rankName: string;
  progress: number;
  nextRankName: string;
  pointsToNextRank: number;
}

const RankDisplay = ({ 
  currentRank = 1, 
  rankName = 'Crystal I', 
  progress = 65, 
  nextRankName = 'Crystal II', 
  pointsToNextRank = 350 
}: RankDisplayProps) => {
  const [isHovering, setIsHovering] = useState(false);
  
  const rankColors = [
    { color: '#B9F2FF', shadow: '#77D1E6' },  // Crystal I
    { color: '#A0E9FF', shadow: '#62C9E6' },  // Crystal II
    { color: '#87E0FF', shadow: '#4DB4E6' },  // Crystal III
    { color: '#6DD7FF', shadow: '#389FE6' },  // Crystal IV
    { color: '#54CEFF', shadow: '#248AE6' },  // Crystal V
    { color: '#3AC6FF', shadow: '#1075E6' },  // Crystal VI
    { color: '#21BDFF', shadow: '#0060E6' },  // Crystal VII
    { color: '#08B4FF', shadow: '#004BE6' },  // Crystal VIII
    { color: '#00ABFF', shadow: '#0036E6' },  // Crystal IX
    { color: '#00A2FF', shadow: '#0021E6' },  // Crystal X
  ];
  
  const currentRankColor = rankColors[Math.min(currentRank - 1, rankColors.length - 1)];
  
  return (
    <TooltipProvider>
      <Card className="overflow-hidden border">
        <CardHeader className="p-5 pb-0">
          <div className="flex justify-between items-center">
            <CardTitle className="text-base font-medium">Your Rank</CardTitle>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4 text-muted-foreground cursor-pointer" />
              </TooltipTrigger>
              <TooltipContent className="max-w-[220px]">
                <p className="text-sm">
                  Complete tasks and earn ST Coins to level up your rank. Higher ranks give access to exclusive rewards and higher earning rates.
                </p>
              </TooltipContent>
            </Tooltip>
          </div>
          <CardDescription>Earn more to advance to the next level</CardDescription>
        </CardHeader>
        
        <CardContent className="p-5">
          <div 
            className="flex items-center justify-between mt-2 p-3 rounded-lg bg-gradient-to-r from-card/80 to-card"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            <div className="flex items-center">
              <motion.div
                animate={{ 
                  rotate: isHovering ? [0, -10, 10, -10, 10, 0] : 0,
                  scale: isHovering ? [1, 1.1, 1] : 1
                }}
                transition={{ duration: 0.5 }}
                className="relative mr-3"
              >
                <Diamond 
                  fill={currentRankColor.color} 
                  stroke={currentRankColor.shadow} 
                  strokeWidth={1} 
                  className="h-10 w-10 drop-shadow-lg" 
                />
                <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xs font-bold text-white">
                  {currentRank}
                </span>
              </motion.div>
              
              <div>
                <div className="font-semibold">{rankName}</div>
                <div className="text-xs text-muted-foreground">
                  {pointsToNextRank} ST Coins to {nextRankName}
                </div>
              </div>
            </div>
            
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </div>
          
          <div className="mt-4">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-muted-foreground">Progress to next rank</span>
              <span className="font-medium">{progress}%</span>
            </div>
            <Progress value={progress} className="h-1" />
          </div>
          
          <div className="mt-4 flex justify-between items-center">
            <div className="flex items-center text-xs text-muted-foreground">
              <Trophy className="h-3 w-3 mr-1 text-amber-500" />
              <span>Rank 120 globally</span>
            </div>
            <div className="text-xs text-muted-foreground">
              Top 5%
            </div>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
};

export default RankDisplay;

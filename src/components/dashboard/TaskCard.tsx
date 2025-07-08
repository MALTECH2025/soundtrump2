
import { useState } from 'react';
import { Clock, Music2, Check, ExternalLink, Users, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { toast } from '@/lib/toast';
import { motion } from 'framer-motion';

export interface TaskProps {
  id: string;
  title: string;
  description: string;
  reward: number;
  category: 'spotify' | 'social' | 'referral' | 'daily' | 'music' | 'other';
  expiresAt: Date;
  completed?: boolean;
  progress?: number;
}

const getCategoryColor = (category: TaskProps['category']) => {
  switch (category) {
    case 'spotify':
      return 'bg-[#1DB954]/10 text-[#1DB954] border-[#1DB954]/30';
    case 'music':
      return 'bg-[#1DB954]/10 text-[#1DB954] border-[#1DB954]/30';
    case 'social':
      return 'bg-blue-500/10 text-blue-500 border-blue-500/30';
    case 'referral':
      return 'bg-purple-500/10 text-purple-500 border-purple-500/30';
    case 'daily':
      return 'bg-orange-500/10 text-orange-500 border-orange-500/30';
    default:
      return 'bg-gray-500/10 text-gray-500 border-gray-500/30';
  }
};

const getCategoryIcon = (category: TaskProps['category']) => {
  switch (category) {
    case 'spotify':
    case 'music':
      return <Music2 className="w-3 h-3" />;
    case 'referral':
      return <Users className="w-3 h-3" />;
    case 'daily':
      return <Calendar className="w-3 h-3" />;
    default:
      return null;
  }
};

const TaskCard = ({ task }: { task: TaskProps }) => {
  const [isCompleting, setIsCompleting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(task.completed || false);
  const [progress, setProgress] = useState(task.progress || 0);
  
  // Calculate time remaining
  const now = new Date();
  const expiresAt = new Date(task.expiresAt);
  const timeRemaining = expiresAt.getTime() - now.getTime();
  const hoursRemaining = Math.floor(timeRemaining / (1000 * 60 * 60));
  const minutesRemaining = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
  
  const isExpired = timeRemaining <= 0;
  const isExpiringSoon = !isExpired && hoursRemaining < 1;
  
  const handleCompleteTask = () => {
    setIsCompleting(true);
    
    // Simulate API call to complete task
    setTimeout(() => {
      setIsCompleted(true);
      setProgress(100);
      setIsCompleting(false);
      toast.success(`Completed task: ${task.title}`, {
        description: `You earned ${task.reward} ST Coins!`
      });
    }, 1500);
  };
  
  const handleVerifyProgress = () => {
    setIsCompleting(true);
    
    // Simulate API call to verify progress
    setTimeout(() => {
      const newProgress = Math.min(progress + 25, 100);
      setProgress(newProgress);
      setIsCompleting(false);
      
      if (newProgress === 100) {
        setIsCompleted(true);
        toast.success(`Completed task: ${task.title}`, {
          description: `You earned ${task.reward} ST Coins!`
        });
      } else {
        toast.info(`Progress updated: ${newProgress}%`, {
          description: 'Keep going to complete this task!'
        });
      }
    }, 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -4 }}
      className="h-full"
    >
      <Card className={`h-full border ${isCompleted ? 'bg-gradient-to-r from-green-500/5 to-green-400/10 border-green-500/30' : ''}`}>
        <CardContent className="p-5">
          <div className="flex justify-between items-start">
            <Badge variant="outline" className={`${getCategoryColor(task.category)} flex items-center gap-1`}>
              {getCategoryIcon(task.category)}
              {task.category.charAt(0).toUpperCase() + task.category.slice(1)}
            </Badge>
            
            <div className="flex items-center">
              {isExpired ? (
                <Badge variant="destructive" className="text-xs">Expired</Badge>
              ) : (
                <div className="flex items-center text-xs text-muted-foreground">
                  <Clock className="w-3 h-3 mr-1" />
                  {isExpiringSoon ? (
                    <span className="text-amber-500">
                      {minutesRemaining}m left
                    </span>
                  ) : (
                    <span>
                      {hoursRemaining}h {minutesRemaining}m left
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
          
          <div className="mt-4">
            <h3 className="font-medium text-base">{task.title}</h3>
            <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
          </div>
          
          {progress > 0 && progress < 100 && (
            <div className="mt-4">
              <div className="flex justify-between text-xs mb-1">
                <span>Progress</span>
                <span className="font-medium">{progress}%</span>
              </div>
              <Progress value={progress} className="h-1" />
            </div>
          )}
          
          <div className="mt-4 flex items-center">
            <div className="text-sm font-medium text-sound-light">{task.reward} ST</div>
          </div>
        </CardContent>
        
        <CardFooter className="p-3 pt-0">
          {isCompleted ? (
            <Button variant="ghost" className="w-full" disabled>
              <Check className="w-4 h-4 mr-2 text-green-500" />
              Completed
            </Button>
          ) : (
            <>
              {task.category === 'spotify' || task.category === 'music' ? (
                <Button 
                  variant="outline" 
                  className="w-full" 
                  disabled={isExpired || isCompleting}
                  onClick={handleVerifyProgress}
                >
                  {isCompleting ? (
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <Music2 className="w-4 h-4 mr-2" />
                  )}
                  Verify Progress
                </Button>
              ) : (
                <Button 
                  variant="default" 
                  className="w-full" 
                  disabled={isExpired || isCompleting}
                  onClick={handleCompleteTask}
                >
                  {isCompleting ? (
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <ExternalLink className="w-4 h-4 mr-2" />
                  )}
                  Complete Task
                </Button>
              )}
            </>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default TaskCard;

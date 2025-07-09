
import { useState } from 'react';
import { Clock, Music2, Check, ExternalLink, Users, Calendar, Globe, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
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
  redirectUrl?: string;
  instructions?: string;
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
  
  const handleCompleteTask = async () => {
    if (isCompleted) {
      toast.info('Task already completed!');
      return;
    }
    
    setIsCompleting(true);
    
    try {
      // Import the completeTask function
      const { completeTask } = await import('@/lib/api/tasks/userTasks');
      const result = await completeTask(task.id);
      
      setIsCompleted(true);
      setProgress(100);
      toast.success(result.message, {
        description: `You earned ${result.points_earned} ST Coins! Check your balance.`
      });
      
      // Trigger a page refresh to update balance
      setTimeout(() => window.location.reload(), 2000);
      
    } catch (error: any) {
      toast.error(error.message || 'Failed to complete task');
    } finally {
      setIsCompleting(false);
    }
  };
  
  const handleStartTask = async () => {
    if (isCompleted) {
      toast.info('Task already completed!');
      return;
    }
    
    setIsCompleting(true);
    
    try {
      const { startTask } = await import('@/lib/api/tasks/userTasks');
      await startTask(task.id);
      
      setProgress(25);
      toast.success('Task started successfully!', {
        description: 'Follow the instructions below to complete it.'
      });
      
    } catch (error: any) {
      toast.error(error.message || 'Failed to start task');
    } finally {
      setIsCompleting(false);
    }
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

          {/* Task Instructions */}
          {task.instructions && (
            <Alert className="mt-3">
              <Info className="h-4 w-4" />
              <AlertDescription className="text-sm">
                <strong>How to complete:</strong> {task.instructions}
              </AlertDescription>
            </Alert>
          )}

          {/* Display task URL if available */}
          {task.redirectUrl && (
            <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center text-sm text-blue-700 mb-2">
                <Globe className="w-4 h-4 mr-2" />
                <strong>Task Link:</strong>
              </div>
              <a 
                href={task.redirectUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:text-blue-800 underline break-all block mb-2"
              >
                {task.redirectUrl.length > 60 ? `${task.redirectUrl.substring(0, 60)}...` : task.redirectUrl}
              </a>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(task.redirectUrl, '_blank')}
                className="w-full"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Open Task Link
              </Button>
            </div>
          )}
          
          {progress > 0 && progress < 100 && (
            <div className="mt-4">
              <div className="flex justify-between text-xs mb-1">
                <span>Progress</span>
                <span className="font-medium">{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}
          
          <div className="mt-4 flex items-center justify-between">
            <div className="text-lg font-bold text-green-600">{task.reward} ST Coins</div>
            {isCompleted && (
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                ✓ Completed
              </Badge>
            )}
          </div>
        </CardContent>
        
        <CardFooter className="p-3 pt-0">
          {isCompleted ? (
            <Button variant="ghost" className="w-full" disabled>
              <Check className="w-4 h-4 mr-2 text-green-500" />
              Task Completed
            </Button>
          ) : progress === 0 ? (
            <Button 
              variant="default" 
              className="w-full" 
              disabled={isExpired || isCompleting}
              onClick={handleStartTask}
            >
              {isCompleting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Starting...
                </>
              ) : (
                <>
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Start Task
                </>
              )}
            </Button>
          ) : (
            <Button 
              variant="default" 
              className="w-full bg-green-600 hover:bg-green-700" 
              disabled={isExpired || isCompleting}
              onClick={handleCompleteTask}
            >
              {isCompleting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Completing...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Complete Task
                </>
              )}
            </Button>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default TaskCard;

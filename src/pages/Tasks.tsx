
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { AnimatedTransition } from '@/components/ui/AnimatedTransition';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/lib/toast';
import { 
  Clock, 
  Music2, 
  Share, 
  Users, 
  CheckCircle2, 
  Lock, 
  ChevronRight, 
  Trophy,
  Flame,
  Calendar,
  Twitter,
  Facebook,
  Instagram,
  PlayCircle
} from 'lucide-react';
import { fetchTasks, fetchUserTasks } from '@/lib/api';
import { Task, UserTask } from '@/types';

const Tasks = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated, user: authUser } = useAuth();
  
  const { data: tasks = [], isLoading: tasksLoading } = useQuery({
    queryKey: ['tasks'],
    queryFn: fetchTasks,
    enabled: isAuthenticated,
  });
  
  const { data: userTasks = [], isLoading: userTasksLoading } = useQuery({
    queryKey: ['userTasks', authUser?.id],
    queryFn: () => fetchUserTasks(authUser?.id || ''),
    enabled: isAuthenticated && !!authUser?.id,
  });
  
  useEffect(() => {
    if (!tasksLoading && !userTasksLoading) {
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [tasksLoading, userTasksLoading]);
  
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };
  
  const handleTaskComplete = (taskId: string) => {
    toast.success(`Starting task...`);
    // In a real app, this would call an API to mark the task as started or completed
  };

  const getCategoryIcon = (categoryName: string | undefined) => {
    const name = (categoryName || '').toLowerCase();
    if (name.includes('music') || name.includes('spotify')) return <Music2 className="w-4 h-4 mr-2" />;
    if (name.includes('social')) return <Share className="w-4 h-4 mr-2" />;
    if (name.includes('daily')) return <Calendar className="w-4 h-4 mr-2" />;
    return <Trophy className="w-4 h-4 mr-2" />;
  };

  const getTaskProgress = (task: Task): number => {
    const userTask = userTasks.find(ut => ut.task_id === task.id);
    if (!userTask) return 0;
    if (userTask.status === 'Completed') return 100;
    if (userTask.status === 'Pending') return 50;
    return 0;
  };

  const isTaskCompleted = (task: Task): boolean => {
    const userTask = userTasks.find(ut => ut.task_id === task.id);
    return userTask?.status === 'Completed';
  };

  const renderTaskCard = (task: Task) => {
    const progress = getTaskProgress(task);
    const completed = isTaskCompleted(task);
    const categoryName = task.category?.name || 'Other';
    const isPremium = task.difficulty === 'Hard';

    return (
      <Card key={task.id} className="bg-card/80">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            {task.title}
            {isPremium && (
              <Badge variant="secondary">
                Premium
              </Badge>
            )}
          </CardTitle>
          <CardDescription>{task.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="flex justify-between items-center text-xs text-muted-foreground mb-1">
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} />
          </div>
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-2" />
              {task.estimated_time || '1 day'}
            </div>
            <div className="flex items-center">
              <Trophy className="w-4 h-4 mr-2" />
              {task.points} Points
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          {completed ? (
            <Badge variant="outline" className="gap-1.5">
              <CheckCircle2 className="h-4 w-4" />
              Completed
            </Badge>
          ) : (
            <Button onClick={() => handleTaskComplete(task.id)}>
              {progress === 100 ? 'Claim Reward' : 'Start Task'}
            </Button>
          )}
        </CardFooter>
      </Card>
    );
  };

  return (
    <AnimatedTransition>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        
        <main className="flex-grow pt-24 pb-12">
          <div className="container px-4 mx-auto">
            {isLoading ? (
              <div className="animate-pulse">
                <div className="h-8 bg-muted w-1/3 mb-6 rounded"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  <div className="h-48 bg-muted rounded-lg"></div>
                  <div className="h-48 bg-muted rounded-lg"></div>
                  <div className="h-48 bg-muted rounded-lg"></div>
                </div>
                <div className="h-6 bg-muted w-1/4 mb-6 rounded"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="h-32 bg-muted rounded-lg"></div>
                  <div className="h-32 bg-muted rounded-lg"></div>
                  <div className="h-32 bg-muted rounded-lg"></div>
                </div>
              </div>
            ) : (
              <>
                <motion.div
                  variants={fadeInUp}
                  initial="hidden"
                  animate="visible"
                  className="mb-6"
                >
                  <h1 className="text-3xl font-bold mb-2">Available Tasks</h1>
                  <p className="text-muted-foreground">Complete tasks to earn rewards</p>
                </motion.div>
                
                <Tabs defaultValue="all" className="w-full">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Task Categories</h2>
                    <TabsList>
                      <TabsTrigger value="all">All</TabsTrigger>
                      <TabsTrigger value="music">Music</TabsTrigger>
                      <TabsTrigger value="social">Social</TabsTrigger>
                      <TabsTrigger value="daily">Daily</TabsTrigger>
                    </TabsList>
                  </div>
                  
                  <TabsContent value="all" className="m-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {tasks.length > 0 ? (
                        tasks.filter(task => task.active).map(renderTaskCard)
                      ) : (
                        <p>No active tasks available at the moment. Check back later!</p>
                      )}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="music" className="m-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {tasks.filter(task => 
                        task.active && 
                        task.category && 
                        (task.category as any).name?.toLowerCase().includes('music')
                      ).map(renderTaskCard)}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="social" className="m-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {tasks.filter(task => 
                        task.active && 
                        task.category && 
                        (task.category as any).name?.toLowerCase().includes('social')
                      ).map(renderTaskCard)}
                    </div>
                  </TabsContent>

                  <TabsContent value="daily" className="m-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {tasks.filter(task => 
                        task.active && 
                        task.category && 
                        (task.category as any).name?.toLowerCase().includes('daily')
                      ).map(renderTaskCard)}
                    </div>
                  </TabsContent>
                </Tabs>
              </>
            )}
          </div>
        </main>
        
        <Footer />
      </div>
    </AnimatedTransition>
  );
};

export default Tasks;

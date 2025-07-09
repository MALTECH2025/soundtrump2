
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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
import { useNotifications } from '@/hooks/useNotifications';
import TaskFilters from '@/components/tasks/TaskFilters';
import { Clock, CheckCircle2, ExternalLink, Trophy, Globe } from 'lucide-react';
import { fetchTasks, fetchUserTasks, startTask, completeTask } from '@/lib/api/tasks';
import { Task, UserTask } from '@/types';
import TaskSubmissionModal from '@/components/tasks/TaskSubmissionModal';
import { getTaskImageUrl } from '@/lib/api/tasks';

const Tasks = () => {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [selectedUserTask, setSelectedUserTask] = useState<UserTask | null>(null);
  const [submissionModalOpen, setSubmissionModalOpen] = useState(false);
  const [processingTasks, setProcessingTasks] = useState<Set<string>>(new Set());
  
  // Filter states
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [selectedPoints, setSelectedPoints] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  
  const { isAuthenticated, user: authUser } = useAuth();
  const { addNotification } = useNotifications();
  const queryClient = useQueryClient();
  
  const { data: tasks = [], isLoading: tasksLoading } = useQuery({
    queryKey: ['tasks'],
    queryFn: fetchTasks,
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
  
  const { data: userTasks = [], isLoading: userTasksLoading } = useQuery({
    queryKey: ['userTasks', authUser?.id],
    queryFn: () => fetchUserTasks(authUser?.id || ''),
    enabled: isAuthenticated && !!authUser?.id,
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });

  const startTaskMutation = useMutation({
    mutationFn: startTask,
    onSuccess: (data, taskId) => {
      queryClient.invalidateQueries({ queryKey: ['userTasks'] });
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      setProcessingTasks(prev => {
        const newSet = new Set(prev);
        newSet.delete(taskId);
        return newSet;
      });
      
      addNotification({
        type: 'task_completed',
        title: 'Task Started!',
        message: 'You can now complete this task to earn ST coins.'
      });
      
      toast.success('Task started! Good luck!');
    },
    onError: (error: any, taskId) => {
      setProcessingTasks(prev => {
        const newSet = new Set(prev);
        newSet.delete(taskId);
        return newSet;
      });
      toast.error(error.message || 'Failed to start task');
    }
  });

  const completeTaskMutation = useMutation({
    mutationFn: completeTask,
    onSuccess: (data, taskId) => {
      if (data && typeof data === 'object' && 'success' in data) {
        if (data.success) {
          queryClient.invalidateQueries({ queryKey: ['userTasks'] });
          queryClient.invalidateQueries({ queryKey: ['tasks'] });
          queryClient.invalidateQueries({ queryKey: ['profile'] });
          setProcessingTasks(prev => {
            const newSet = new Set(prev);
            newSet.delete(taskId);
            return newSet;
          });
          
          addNotification({
            type: 'task_completed',
            title: 'Task Completed! 🎉',
            message: `You earned ${data.points_earned || 'ST'} coins!`
          });
          
          toast.success(`Task completed! You earned ${data.points_earned || 0} ST coins!`);
        } else {
          setProcessingTasks(prev => {
            const newSet = new Set(prev);
            newSet.delete(taskId);
            return newSet;
          });
          toast.error(data.message || 'Failed to complete task');
        }
      } else {
        console.error('Unexpected response format:', data);
        setProcessingTasks(prev => {
          const newSet = new Set(prev);
          newSet.delete(taskId);
          return newSet;
        });
        toast.error('An unexpected error occurred');
      }
    },
    onError: (error: any, taskId) => {
      setProcessingTasks(prev => {
        const newSet = new Set(prev);
        newSet.delete(taskId);
        return newSet;
      });
      toast.error(error.message || 'An error occurred');
    }
  });

  // Filter functions
  const applyFilters = (taskList: any[]) => {
    return taskList.filter((taskData: any) => {
      const task = taskData as Task;
      
      // Difficulty filter
      if (selectedDifficulty !== 'all' && task.difficulty !== selectedDifficulty) {
        return false;
      }
      
      // Points filter
      if (selectedPoints !== 'all') {
        const points = task.points;
        if (selectedPoints === 'low' && points > 50) return false;
        if (selectedPoints === 'medium' && (points <= 50 || points > 150)) return false;
        if (selectedPoints === 'high' && points <= 150) return false;
      }
      
      // Status filter
      if (selectedStatus !== 'all') {
        const { status } = getTaskStatus(task);
        if (selectedStatus === 'available' && status !== 'not_started') return false;
        if (selectedStatus === 'in_progress' && status !== 'in_progress') return false;
        if (selectedStatus === 'completed' && status !== 'completed') return false;
      }
      
      return task.active;
    });
  };

  const resetFilters = () => {
    setSelectedDifficulty('all');
    setSelectedPoints('all');
    setSelectedStatus('all');
  };

  const getUserTask = (taskId: string): UserTask | undefined => {
    return userTasks.find((ut: any) => ut.task_id === taskId) as UserTask | undefined;
  };

  const getTaskStatus = (task: Task): { status: string; progress: number; userTask?: UserTask } => {
    const userTask = getUserTask(task.id);
    
    if (!userTask) {
      return { status: 'not_started', progress: 0 };
    }
    
    const status = userTask.status as "Pending" | "Submitted" | "Completed" | "Rejected";
    
    switch (status) {
      case 'Pending':
        return { status: 'in_progress', progress: 25, userTask };
      case 'Submitted':
        return { status: 'submitted', progress: 75, userTask };
      case 'Completed':
        return { status: 'completed', progress: 100, userTask };
      case 'Rejected':
        return { status: 'rejected', progress: 0, userTask };
      default:
        return { status: 'not_started', progress: 0 };
    }
  };

  const handleTaskAction = (task: Task) => {
    const { status, userTask } = getTaskStatus(task);
    
    // Don't allow starting a task that's already completed
    if (status === 'completed') {
      toast.info('Task already completed!');
      return;
    }
    
    setProcessingTasks(prev => new Set(prev).add(task.id));
    
    switch (status) {
      case 'not_started':
        startTaskMutation.mutate(task.id);
        break;
      case 'in_progress':
        if (task.verification_type === 'Manual') {
          setSelectedTask(task);
          setSelectedUserTask(userTask as UserTask);
          setSubmissionModalOpen(true);
          setProcessingTasks(prev => {
            const newSet = new Set(prev);
            newSet.delete(task.id);
            return newSet;
          });
        } else {
          completeTaskMutation.mutate(task.id);
        }
        break;
      case 'submitted':
        setProcessingTasks(prev => {
          const newSet = new Set(prev);
          newSet.delete(task.id);
          return newSet;
        });
        toast.info('Task is pending admin review');
        break;
      case 'rejected':
        toast.error('Task was rejected. You can try again.');
        startTaskMutation.mutate(task.id);
        break;
    }
  };

  const getActionButtonText = (task: Task) => {
    const { status } = getTaskStatus(task);
    
    switch (status) {
      case 'not_started':
        return 'Start Task';
      case 'in_progress':
        return task.verification_type === 'Manual' ? 'Submit Task' : 'Complete Task';
      case 'submitted':
        return 'Pending Review';
      case 'completed':
        return 'Completed';
      case 'rejected':
        return 'Try Again';
      default:
        return 'Start Task';
    }
  };

  const getActionButtonVariant = (task: Task) => {
    const { status } = getTaskStatus(task);
    
    switch (status) {
      case 'completed':
        return 'secondary';
      case 'submitted':
        return 'outline';
      case 'rejected':
        return 'destructive';
      default:
        return 'default';
    }
  };

  const isActionDisabled = (task: Task) => {
    const { status } = getTaskStatus(task);
    return status === 'submitted' || status === 'completed' || processingTasks.has(task.id);
  };

  const renderTaskCard = (taskData: any) => {
    const task = {
      ...taskData,
      difficulty: taskData.difficulty as "Easy" | "Medium" | "Hard",
      verification_type: taskData.verification_type as "Automatic" | "Manual",
    } as Task;
    
    const { status, progress, userTask } = getTaskStatus(task);
    const isPremium = task.difficulty === 'Hard';
    const isProcessing = processingTasks.has(task.id);
    const taskImageUrl = task.image_url ? getTaskImageUrl(task.image_url) : null;

    // Get the latest submission for status messages
    const latestSubmission = userTask?.submission && userTask.submission.length > 0 
      ? userTask.submission[userTask.submission.length - 1] 
      : null;

    return (
      <Card key={task.id} className="bg-card/80 hover:shadow-lg transition-shadow">
        {taskImageUrl && (
          <div className="aspect-video w-full overflow-hidden rounded-t-lg">
            <img 
              src={taskImageUrl} 
              alt={task.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            {task.title}
            <div className="flex gap-2">
              {isPremium && <Badge variant="secondary">Premium</Badge>}
              {task.verification_type === 'Manual' && (
                <Badge variant="outline">Manual Review</Badge>
              )}
            </div>
          </CardTitle>
          <CardDescription>{task.description}</CardDescription>
          {task.instructions && (
            <div className="mt-2 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">{task.instructions}</p>
            </div>
          )}
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="flex justify-between items-center text-xs text-muted-foreground mb-1">
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} />
            {userTask?.status === 'Submitted' && (
              <p className="text-xs text-orange-600 mt-1">Waiting for admin review</p>
            )}
            {userTask?.status === 'Rejected' && latestSubmission?.admin_notes && (
              <p className="text-xs text-red-600 mt-1">Rejected: {latestSubmission.admin_notes}</p>
            )}
          </div>
          
          <div className="flex items-center justify-between text-sm mb-3">
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-2" />
              {task.estimated_time || '1 day'}
            </div>
            <div className="flex items-center">
              <Trophy className="w-4 h-4 mr-2 text-yellow-500" />
              <span className="font-medium text-sound-light">{task.points} ST</span>
            </div>
          </div>

          {/* Display task URL if available */}
          {task.redirect_url && (
            <div className="mb-3 p-2 bg-gray-50 rounded-lg">
              <div className="flex items-center text-xs text-gray-600 mb-1">
                <Globe className="w-3 h-3 mr-1" />
                Task URL:
              </div>
              <a 
                href={task.redirect_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs text-blue-600 hover:text-blue-800 underline break-all"
              >
                {task.redirect_url}
              </a>
            </div>
          )}
          
          {task.expires_at && (
            <div className="mb-3 p-2 bg-amber-50 rounded-lg">
              <p className="text-xs text-amber-700">
                Expires: {new Date(task.expires_at).toLocaleDateString()} at {new Date(task.expires_at).toLocaleTimeString()}
              </p>
            </div>
          )}
          
          {task.redirect_url && status === 'in_progress' && (
            <div className="mt-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(task.redirect_url, '_blank')}
                className="w-full"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Go to Task
              </Button>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-end">
          {status === 'completed' ? (
            <Badge variant="outline" className="gap-1.5 bg-green-50 text-green-700 border-green-200">
              <CheckCircle2 className="h-4 w-4" />
              Completed
            </Badge>
          ) : (
            <Button 
              onClick={() => handleTaskAction(task)}
              disabled={isActionDisabled(task)}
              variant={getActionButtonVariant(task) as any}
            >
              {isProcessing ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                getActionButtonText(task)
              )}
            </Button>
          )}
        </CardFooter>
      </Card>
    );
  };

  if (!isAuthenticated) {
    return (
      <AnimatedTransition>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-grow pt-24 pb-12 flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-2xl font-bold mb-4">Please log in to view tasks</h1>
              <p className="text-muted-foreground">Sign in to your account to access available tasks.</p>
            </div>
          </main>
          <Footer />
        </div>
      </AnimatedTransition>
    );
  }

  const filteredTasks = applyFilters(tasks);

  return (
    <AnimatedTransition>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        
        <main className="flex-grow pt-24 pb-12">
          <div className="container px-4 mx-auto">
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
              }}
              initial="hidden"
              animate="visible"
              className="mb-6"
            >
              <h1 className="text-3xl font-bold mb-2">Available Tasks</h1>
              <p className="text-muted-foreground">Complete tasks to earn ST rewards</p>
            </motion.div>

            {/* Task Filters */}
            <TaskFilters
              selectedDifficulty={selectedDifficulty}
              selectedPoints={selectedPoints}
              selectedStatus={selectedStatus}
              onDifficultyChange={setSelectedDifficulty}
              onPointsChange={setSelectedPoints}
              onStatusChange={setSelectedStatus}
              onReset={resetFilters}
            />
            
            <Tabs defaultValue="all" className="w-full">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Task Categories</h2>
                <TabsList>
                  <TabsTrigger value="all">All ({filteredTasks.length})</TabsTrigger>
                  <TabsTrigger value="music">Music</TabsTrigger>
                  <TabsTrigger value="social">Social</TabsTrigger>
                  <TabsTrigger value="daily">Daily</TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="all" className="m-0">
                {tasksLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-64 bg-muted rounded-lg animate-pulse"></div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredTasks.length > 0 ? (
                      filteredTasks.map(renderTaskCard)
                    ) : (
                      <div className="col-span-full text-center py-12">
                        <p className="text-muted-foreground mb-4">No tasks match your current filters.</p>
                        <Button onClick={resetFilters} variant="outline">
                          Reset Filters
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="music" className="m-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {applyFilters(tasks.filter((taskData: any) => 
                    taskData.category && 
                    (taskData.category as any).name?.toLowerCase().includes('music')
                  )).map(renderTaskCard)}
                </div>
              </TabsContent>
              
              <TabsContent value="social" className="m-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {applyFilters(tasks.filter((taskData: any) => 
                    taskData.category && 
                    (taskData.category as any).name?.toLowerCase().includes('social')
                  )).map(renderTaskCard)}
                </div>
              </TabsContent>

              <TabsContent value="daily" className="m-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {applyFilters(tasks.filter((taskData: any) => 
                    taskData.category && 
                    (taskData.category as any).name?.toLowerCase().includes('daily')
                  )).map(renderTaskCard)}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>
        
        <Footer />
      </div>

      {/* Task Submission Modal */}
      {selectedTask && selectedUserTask && (
        <TaskSubmissionModal
          isOpen={submissionModalOpen}
          onClose={() => setSubmissionModalOpen(false)}
          task={selectedTask}
          userTask={selectedUserTask}
          onSuccess={() => {
            queryClient.invalidateQueries({ queryKey: ['userTasks'] });
            queryClient.invalidateQueries({ queryKey: ['profile'] });
          }}
        />
      )}
    </AnimatedTransition>
  );
};

export default Tasks;

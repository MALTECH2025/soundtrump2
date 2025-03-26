import { useState, useEffect } from 'react';
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

interface Task {
  id: string;
  title: string;
  description: string;
  reward: number;
  progress?: number;
  expiresIn: string;
  isPremium?: boolean;
  isCompleted?: boolean;
  category: 'music' | 'social' | 'daily';
}

const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Stream Daily Drive playlist for 30 minutes',
    description: 'Connect your Spotify account and stream the Daily Drive playlist for at least 30 minutes.',
    reward: 25,
    progress: 75,
    expiresIn: '2 hours',
    isPremium: false,
    isCompleted: false,
    category: 'music'
  },
  {
    id: '2',
    title: 'Share your favorite song on Twitter',
    description: 'Share the song you are currently listening to on Twitter with #SoundTrump.',
    reward: 15,
    progress: 100,
    expiresIn: '6 hours',
    isPremium: false,
    isCompleted: true,
    category: 'social'
  },
  {
    id: '3',
    title: 'Invite 5 friends to join SoundTrump',
    description: 'Share your referral link with friends and get them to sign up.',
    reward: 50,
    progress: 40,
    expiresIn: '1 day',
    isPremium: true,
    isCompleted: false,
    category: 'daily'
  },
  {
    id: '4',
    title: 'Listen to 20 different songs today',
    description: 'Explore new music and listen to at least 20 different songs.',
    reward: 20,
    progress: 0,
    expiresIn: '12 hours',
    isPremium: false,
    isCompleted: false,
    category: 'music'
  },
  {
    id: '5',
    title: 'Share SoundTrump on Facebook',
    description: 'Create a post about SoundTrump on Facebook and share your referral link.',
    reward: 15,
    progress: 0,
    expiresIn: '1 day',
    isPremium: true,
    isCompleted: false,
    category: 'social'
  }
];

const Tasks = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated } = useAuth();
  
  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };
  
  const handleTaskComplete = (taskId: string) => {
    toast.success(`Task ${taskId} completed!`);
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
                      {mockTasks.map((task) => (
                        <Card key={task.id} className="bg-card/80">
                          <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                              {task.title}
                              {task.isPremium && (
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
                                <span>{task.progress}%</span>
                              </div>
                              <Progress value={task.progress} />
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <div className="flex items-center">
                                <Clock className="w-4 h-4 mr-2" />
                                Expires in {task.expiresIn}
                              </div>
                              <div className="flex items-center">
                                <Trophy className="w-4 h-4 mr-2" />
                                {task.reward} Points
                              </div>
                            </div>
                          </CardContent>
                          <CardFooter className="flex justify-end">
                            {task.isCompleted ? (
                              <Badge variant="outline" className="gap-1.5">
                                <CheckCircle2 className="h-4 w-4" />
                                Completed
                              </Badge>
                            ) : (
                              <Button onClick={() => handleTaskComplete(task.id)}>
                                {task.progress === 100 ? 'Claim Reward' : 'Start Task'}
                              </Button>
                            )}
                          </CardFooter>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="music" className="m-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {mockTasks
                        .filter(task => task.category === 'music')
                        .map((task) => (
                          <Card key={task.id} className="bg-card/80">
                            <CardHeader>
                              <CardTitle className="flex items-center justify-between">
                                {task.title}
                                {task.isPremium && (
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
                                  <span>{task.progress}%</span>
                                </div>
                                <Progress value={task.progress} />
                              </div>
                              <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center">
                                  <Clock className="w-4 h-4 mr-2" />
                                  Expires in {task.expiresIn}
                                </div>
                                <div className="flex items-center">
                                  <Trophy className="w-4 h-4 mr-2" />
                                  {task.reward} Points
                                </div>
                              </div>
                            </CardContent>
                            <CardFooter className="flex justify-end">
                              {task.isCompleted ? (
                                <Badge variant="outline" className="gap-1.5">
                                  <CheckCircle2 className="h-4 w-4" />
                                  Completed
                                </Badge>
                              ) : (
                                <Button onClick={() => handleTaskComplete(task.id)}>
                                  {task.progress === 100 ? 'Claim Reward' : 'Start Task'}
                                </Button>
                              )}
                            </CardFooter>
                          </Card>
                        ))}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="social" className="m-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {mockTasks
                        .filter(task => task.category === 'social')
                        .map((task) => (
                          <Card key={task.id} className="bg-card/80">
                            <CardHeader>
                              <CardTitle className="flex items-center justify-between">
                                {task.title}
                                {task.isPremium && (
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
                                  <span>{task.progress}%</span>
                                </div>
                                <Progress value={task.progress} />
                              </div>
                              <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center">
                                  <Clock className="w-4 h-4 mr-2" />
                                  Expires in {task.expiresIn}
                                </div>
                                <div className="flex items-center">
                                  <Trophy className="w-4 h-4 mr-2" />
                                  {task.reward} Points
                                </div>
                              </div>
                            </CardContent>
                            <CardFooter className="flex justify-end">
                              {task.isCompleted ? (
                                <Badge variant="outline" className="gap-1.5">
                                  <CheckCircle2 className="h-4 w-4" />
                                  Completed
                                </Badge>
                              ) : (
                                <Button onClick={() => handleTaskComplete(task.id)}>
                                  {task.progress === 100 ? 'Claim Reward' : 'Start Task'}
                                </Button>
                              )}
                            </CardFooter>
                          </Card>
                        ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="daily" className="m-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {mockTasks
                        .filter(task => task.category === 'daily')
                        .map((task) => (
                          <Card key={task.id} className="bg-card/80">
                            <CardHeader>
                              <CardTitle className="flex items-center justify-between">
                                {task.title}
                                {task.isPremium && (
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
                                  <span>{task.progress}%</span>
                                </div>
                                <Progress value={task.progress} />
                              </div>
                              <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center">
                                  <Clock className="w-4 h-4 mr-2" />
                                  Expires in {task.expiresIn}
                                </div>
                                <div className="flex items-center">
                                  <Trophy className="w-4 h-4 mr-2" />
                                  {task.reward} Points
                                </div>
                              </div>
                            </CardContent>
                            <CardFooter className="flex justify-end">
                              {task.isCompleted ? (
                                <Badge variant="outline" className="gap-1.5">
                                  <CheckCircle2 className="h-4 w-4" />
                                  Completed
                                </Badge>
                              ) : (
                                <Button onClick={() => handleTaskComplete(task.id)}>
                                  {task.progress === 100 ? 'Claim Reward' : 'Start Task'}
                                </Button>
                              )}
                            </CardFooter>
                          </Card>
                        ))}
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


import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import AnimatedTransition from '@/components/ui/AnimatedTransition';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import TaskCard, { TaskProps } from '@/components/dashboard/TaskCard';
import { Search, Music2, Users, AlertTriangle, RefreshCw, Filter } from 'lucide-react';

// Mock data - expanded set of tasks
const allTasks: TaskProps[] = [
  {
    id: '1',
    title: 'Stream Viral Hits playlist for 30 minutes',
    description: 'Connect your Spotify account and stream the Viral Hits playlist for at least 30 minutes.',
    reward: 25,
    category: 'spotify',
    expiresAt: new Date(Date.now() + 86400000 * 2), // 2 days from now
    progress: 0
  },
  {
    id: '2',
    title: 'Share SoundTrump on social media',
    description: 'Create a post about SoundTrump on any social media platform and submit the link.',
    reward: 15,
    category: 'social',
    expiresAt: new Date(Date.now() + 86400000 * 3) // 3 days from now
  },
  {
    id: '3',
    title: 'Refer 3 new users',
    description: 'Get 3 friends to sign up using your referral code.',
    reward: 50,
    category: 'referral',
    expiresAt: new Date(Date.now() + 86400000 * 7) // 7 days from now
  },
  {
    id: '4',
    title: 'Complete a 15-song listening streak',
    description: 'Listen to 15 different songs in a row without skipping.',
    reward: 20,
    category: 'spotify',
    expiresAt: new Date(Date.now() + 86400000), // 1 day from now
    progress: 60
  },
  {
    id: '5',
    title: 'Listen to New Releases playlist',
    description: 'Stream songs from the New Releases playlist for at least 20 minutes.',
    reward: 15,
    category: 'spotify',
    expiresAt: new Date(Date.now() + 86400000 * 4), // 4 days from now
  },
  {
    id: '6',
    title: 'Follow SoundTrump on social media',
    description: 'Follow our official accounts on Twitter and Instagram.',
    reward: 10,
    category: 'social',
    expiresAt: new Date(Date.now() + 86400000 * 5), // 5 days from now
  },
  {
    id: '7',
    title: 'Complete the Artist Discovery challenge',
    description: 'Listen to 5 songs from artists you've never played before.',
    reward: 30,
    category: 'spotify',
    expiresAt: new Date(Date.now() + 86400000 * 3), // 3 days from now
    progress: 40
  },
  {
    id: '8',
    title: 'Refer a Premium Spotify user',
    description: 'Get a friend with Spotify Premium to sign up using your referral code.',
    reward: 45,
    category: 'referral',
    expiresAt: new Date(Date.now() + 86400000 * 10), // 10 days from now
  },
  {
    id: '9',
    title: 'Weekend Music Marathon',
    description: 'Stream music for at least 2 hours over this weekend.',
    reward: 35,
    category: 'spotify',
    expiresAt: new Date(Date.now() + 86400000 * 2), // 2 days from now
    progress: 25
  },
  {
    id: '10',
    title: 'Create a SoundTrump playlist',
    description: 'Create a playlist with at least 10 songs and share it with your friends.',
    reward: 20,
    category: 'social',
    expiresAt: new Date(Date.now() + 86400000 * 6), // 6 days from now
  },
  {
    id: '11',
    title: 'Participate in community forum',
    description: 'Make at least 3 comments on our community forum discussions.',
    reward: 15,
    category: 'social',
    expiresAt: new Date(Date.now() + 86400000 * 4), // 4 days from now
  },
  {
    id: '12',
    title: 'Complete 5 referrals this month',
    description: 'Get 5 new users to join using your referral link this month.',
    reward: 75,
    category: 'referral',
    expiresAt: new Date(Date.now() + 86400000 * 14), // 14 days from now
  },
];

// Mock completed tasks
const completedTasks: TaskProps[] = [
  {
    id: '101',
    title: 'Listen to Top 40 Hits playlist',
    description: 'Stream the Top 40 Hits playlist for at least 30 minutes.',
    reward: 20,
    category: 'spotify',
    expiresAt: new Date(Date.now() - 86400000), // 1 day ago
    completed: true,
    progress: 100
  },
  {
    id: '102',
    title: 'Share your first achievement',
    description: 'Share one of your SoundTrump achievements on social media.',
    reward: 10,
    category: 'social',
    expiresAt: new Date(Date.now() - 86400000 * 2), // 2 days ago
    completed: true,
    progress: 100
  },
  {
    id: '103',
    title: 'Refer your first user',
    description: 'Get your first friend to sign up using your referral code.',
    reward: 25,
    category: 'referral',
    expiresAt: new Date(Date.now() - 86400000 * 3), // 3 days ago
    completed: true,
    progress: 100
  },
];

const Tasks = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [tasks, setTasks] = useState<TaskProps[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('reward-high');
  const [userProfile, setUserProfile] = useState({
    name: 'Alex Johnson',
    avatar: '',
    initials: 'AJ'
  });
  
  // Filter and sort tasks
  const filterAndSortTasks = (taskList: TaskProps[]) => {
    // Filter by search term
    let filtered = taskList.filter(task => 
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      task.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    // Filter by category if not 'all'
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(task => task.category === selectedCategory);
    }
    
    // Sort based on sortBy value
    switch (sortBy) {
      case 'reward-high':
        return [...filtered].sort((a, b) => b.reward - a.reward);
      case 'reward-low':
        return [...filtered].sort((a, b) => a.reward - b.reward);
      case 'expiry-soon':
        return [...filtered].sort((a, b) => new Date(a.expiresAt).getTime() - new Date(b.expiresAt).getTime());
      default:
        return filtered;
    }
  };
  
  // Filtered and sorted tasks
  const filteredActiveTasks = filterAndSortTasks(allTasks);
  const filteredCompletedTasks = filterAndSortTasks(completedTasks);
  
  // Reset filters
  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSortBy('reward-high');
  };
  
  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setTasks(allTasks);
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  // Animation variants
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };
  
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4 }
    }
  };

  return (
    <AnimatedTransition>
      <div className="min-h-screen flex flex-col">
        <Navbar isAuthenticated={true} userProfile={userProfile} />
        
        <main className="flex-grow pt-24 pb-12">
          <div className="container px-4 mx-auto">
            {isLoading ? (
              // Loading skeleton
              <div className="animate-pulse">
                <div className="h-8 bg-muted w-1/3 mb-6 rounded"></div>
                <div className="h-12 bg-muted w-full mb-6 rounded-lg"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="h-64 bg-muted rounded-lg"></div>
                  ))}
                </div>
              </div>
            ) : (
              <>
                {/* Header and filters */}
                <motion.div
                  variants={fadeInUp}
                  initial="hidden"
                  animate="visible"
                  className="mb-6"
                >
                  <h1 className="text-3xl font-bold mb-2">Tasks</h1>
                  <p className="text-muted-foreground">Complete tasks to earn ST Coins and advance your rank</p>
                </motion.div>
                
                {/* Search and filters */}
                <motion.div 
                  variants={fadeInUp}
                  initial="hidden"
                  animate="visible"
                  className="mb-8 space-y-4"
                >
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-grow">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input 
                        className="pl-10" 
                        placeholder="Search tasks..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    
                    <div className="flex gap-3">
                      <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                        <SelectTrigger className="w-[130px]">
                          <SelectValue placeholder="Category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Categories</SelectItem>
                          <SelectItem value="spotify">Spotify</SelectItem>
                          <SelectItem value="social">Social</SelectItem>
                          <SelectItem value="referral">Referral</SelectItem>
                        </SelectContent>
                      </Select>
                      
                      <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger className="w-[130px]">
                          <SelectValue placeholder="Sort By" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="reward-high">Highest Reward</SelectItem>
                          <SelectItem value="reward-low">Lowest Reward</SelectItem>
                          <SelectItem value="expiry-soon">Expiring Soon</SelectItem>
                        </SelectContent>
                      </Select>
                      
                      <Button variant="outline" size="icon" onClick={resetFilters}>
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  {/* Filter pills/tags */}
                  {(searchTerm || selectedCategory !== 'all' || sortBy !== 'reward-high') && (
                    <div className="flex flex-wrap gap-2">
                      {searchTerm && (
                        <div className="bg-primary/10 text-primary text-xs px-3 py-1 rounded-full flex items-center">
                          <span>Search: {searchTerm}</span>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-4 w-4 ml-1 p-0" 
                            onClick={() => setSearchTerm('')}
                          >
                            <span className="sr-only">Remove</span>
                            <span className="text-xs">×</span>
                          </Button>
                        </div>
                      )}
                      
                      {selectedCategory !== 'all' && (
                        <div className="bg-primary/10 text-primary text-xs px-3 py-1 rounded-full flex items-center">
                          <span>Category: {selectedCategory}</span>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-4 w-4 ml-1 p-0" 
                            onClick={() => setSelectedCategory('all')}
                          >
                            <span className="sr-only">Remove</span>
                            <span className="text-xs">×</span>
                          </Button>
                        </div>
                      )}
                      
                      {sortBy !== 'reward-high' && (
                        <div className="bg-primary/10 text-primary text-xs px-3 py-1 rounded-full flex items-center">
                          <span>
                            Sort: {
                              sortBy === 'reward-low' ? 'Lowest Reward' : 
                              sortBy === 'expiry-soon' ? 'Expiring Soon' : 
                              'Highest Reward'
                            }
                          </span>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-4 w-4 ml-1 p-0" 
                            onClick={() => setSortBy('reward-high')}
                          >
                            <span className="sr-only">Remove</span>
                            <span className="text-xs">×</span>
                          </Button>
                        </div>
                      )}
                      
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-xs h-6 px-2" 
                        onClick={resetFilters}
                      >
                        Clear all filters
                      </Button>
                    </div>
                  )}
                </motion.div>
                
                <Tabs defaultValue="active" className="w-full">
                  <TabsList className="mb-6">
                    <TabsTrigger value="active" className="relative">
                      Active Tasks
                      <span className="ml-2 text-xs bg-primary/20 px-1.5 py-0.5 rounded-full">
                        {filteredActiveTasks.length}
                      </span>
                    </TabsTrigger>
                    <TabsTrigger value="completed">
                      Completed
                      <span className="ml-2 text-xs bg-primary/20 px-1.5 py-0.5 rounded-full">
                        {filteredCompletedTasks.length}
                      </span>
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="active" className="m-0">
                    {filteredActiveTasks.length > 0 ? (
                      <motion.div 
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                        variants={staggerContainer}
                        initial="hidden"
                        animate="visible"
                      >
                        {filteredActiveTasks.map((task) => (
                          <motion.div key={task.id} variants={fadeInUp}>
                            <TaskCard task={task} />
                          </motion.div>
                        ))}
                      </motion.div>
                    ) : (
                      <motion.div
                        variants={fadeInUp}
                        initial="hidden"
                        animate="visible" 
                        className="text-center py-12"
                      >
                        <AlertTriangle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <h3 className="text-xl font-medium mb-2">No tasks found</h3>
                        <p className="text-muted-foreground mb-6">
                          No tasks match your current filters. Try adjusting your search criteria.
                        </p>
                        <Button onClick={resetFilters}>Reset Filters</Button>
                      </motion.div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="completed" className="m-0">
                    {filteredCompletedTasks.length > 0 ? (
                      <motion.div 
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                        variants={staggerContainer}
                        initial="hidden"
                        animate="visible"
                      >
                        {filteredCompletedTasks.map((task) => (
                          <motion.div key={task.id} variants={fadeInUp}>
                            <TaskCard task={task} />
                          </motion.div>
                        ))}
                      </motion.div>
                    ) : (
                      <motion.div
                        variants={fadeInUp}
                        initial="hidden"
                        animate="visible" 
                        className="text-center py-12"
                      >
                        <AlertTriangle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <h3 className="text-xl font-medium mb-2">No completed tasks found</h3>
                        <p className="text-muted-foreground mb-6">
                          You haven't completed any tasks that match your current filters.
                        </p>
                        <Button onClick={resetFilters}>Reset Filters</Button>
                      </motion.div>
                    )}
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

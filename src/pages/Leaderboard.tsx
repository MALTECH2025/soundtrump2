import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AnimatedTransition } from '@/components/ui/AnimatedTransition';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Crown, Medal, Trophy, Users, ChevronRight, UserRound, Music, Zap } from 'lucide-react';
import { useProfile } from '@/context/ProfileContext';

interface LeaderboardEntry {
  id: string;
  name: string;
  avatarUrl: string;
  initials: string;
  points: number;
  tasksCompleted: number;
  tier?: "Free" | "Premium";
  status?: "Normal" | "Influencer";
}

const leaderboardData: LeaderboardEntry[] = [
  {
    id: '1',
    name: 'Ava Thompson',
    avatarUrl: 'https://i.pravatar.cc/150?img=1',
    initials: 'AT',
    points: 4820,
    tasksCompleted: 162,
    tier: "Premium",
    status: "Influencer"
  },
  {
    id: '2',
    name: 'Noah Mitchell',
    avatarUrl: 'https://i.pravatar.cc/150?img=2',
    initials: 'NM',
    points: 4590,
    tasksCompleted: 155,
    tier: "Premium",
    status: "Normal"
  },
  {
    id: '3',
    name: 'Isabella Rodriguez',
    avatarUrl: 'https://i.pravatar.cc/150?img=3',
    initials: 'IR',
    points: 4350,
    tasksCompleted: 148,
    tier: "Premium",
    status: "Influencer"
  },
  {
    id: '4',
    name: 'Jackson White',
    avatarUrl: 'https://i.pravatar.cc/150?img=4',
    initials: 'JW',
    points: 4120,
    tasksCompleted: 141,
    tier: "Free",
    status: "Normal"
  },
  {
    id: '5',
    name: 'Mia Harris',
    avatarUrl: 'https://i.pravatar.cc/150?img=5',
    initials: 'MH',
    points: 3980,
    tasksCompleted: 134,
    tier: "Free",
    status: "Normal"
  },
  {
    id: '6',
    name: 'Aiden Clark',
    avatarUrl: 'https://i.pravatar.cc/150?img=6',
    initials: 'AC',
    points: 3750,
    tasksCompleted: 127,
    tier: "Free",
    status: "Normal"
  },
  {
    id: '7',
    name: 'Sofia Lewis',
    avatarUrl: 'https://i.pravatar.cc/150?img=7',
    initials: 'SL',
    points: 3510,
    tasksCompleted: 120,
    tier: "Free",
    status: "Normal"
  },
  {
    id: '8',
    name: 'Ethan Baker',
    avatarUrl: 'https://i.pravatar.cc/150?img=8',
    initials: 'EB',
    points: 3280,
    tasksCompleted: 113,
    tier: "Free",
    status: "Normal"
  },
  {
    id: '9',
    name: 'Chloe Green',
    avatarUrl: 'https://i.pravatar.cc/150?img=9',
    initials: 'CG',
    points: 3040,
    tasksCompleted: 106,
    tier: "Free",
    status: "Normal"
  },
  {
    id: '10',
    name: 'Liam King',
    avatarUrl: 'https://i.pravatar.cc/150?img=10',
    initials: 'LK',
    points: 2810,
    tasksCompleted: 99,
    tier: "Free",
    status: "Normal"
  }
];

const userRank = {
  rank: 42,
  points: 1250,
  tasksCompleted: 58
};

const Leaderboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [filterPeriod, setFilterPeriod] = useState('weekly');
  const { user } = useProfile();
  
  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  // Helper functions for icon color based on rank
  const getRankIconColor = (rank: number) => {
    switch(rank) {
      case 1: return 'text-yellow-500';
      case 2: return 'text-slate-400';
      case 3: return 'text-amber-600';
      default: return 'text-muted-foreground';
    }
  };
  
  const getRankIcon = (rank: number) => {
    switch(rank) {
      case 1: return <Crown className={`h-5 w-5 ${getRankIconColor(rank)}`} />;
      case 2: return <Medal className={`h-5 w-5 ${getRankIconColor(rank)}`} />;
      case 3: return <Trophy className={`h-5 w-5 ${getRankIconColor(rank)}`} />;
      default: return <span className="text-muted-foreground font-medium">{rank}</span>;
    }
  };
  
  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };
  
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  // Find the current user in the leaderboard data
  const currentUserEntry = leaderboardData.find(entry => entry.name === user?.name);
  
  return (
    <AnimatedTransition>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        
        <main className="flex-grow pt-24 pb-12">
          <div className="container px-4 mx-auto max-w-7xl">
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              className="mb-6"
            >
              <h1 className="text-3xl font-bold mb-2">Leaderboard</h1>
              <p className="text-muted-foreground">See where you rank among other music fans</p>
            </motion.div>
            
            {isLoading ? (
              <div className="animate-pulse">
                <div className="h-8 bg-muted w-1/3 mb-6 rounded"></div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="h-64 bg-muted rounded-lg"></div>
                  <div className="h-64 bg-muted rounded-lg"></div>
                  <div className="h-64 bg-muted rounded-lg"></div>
                </div>
                <div className="h-6 bg-muted w-1/4 mb-6 rounded"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="h-48 bg-muted rounded-lg"></div>
                  <div className="h-48 bg-muted rounded-lg"></div>
                  <div className="h-48 bg-muted rounded-lg"></div>
                  <div className="h-48 bg-muted rounded-lg"></div>
                </div>
              </div>
            ) : (
              <>
                <motion.div
                  variants={fadeInUp}
                  initial="hidden"
                  animate="visible"
                  className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
                >
                  {/* Current User Rank */}
                  <Card className="col-span-1">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Your Ranking</CardTitle>
                      <CardDescription>How you compare to others</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-4">
                        <Avatar className="h-16 w-16 border-2 border-sound-light p-0.5">
                          <AvatarImage src={user?.avatar} alt={user?.name} />
                          <AvatarFallback className="text-lg bg-sound-light text-white">
                            {user?.initials}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-xl">{user?.name}</h3>
                            <div className="flex gap-1">
                              {user?.role?.tier === "Premium" && (
                                <Badge className="bg-sound-light">Premium</Badge>
                              )}
                              {user?.role?.status === "Influencer" && (
                                <Badge className="bg-purple-500">Influencer</Badge>
                              )}
                            </div>
                          </div>
                          
                          <div className="text-2xl font-bold flex items-center mt-1">
                            <span className="text-sound-light mr-1">#{userRank.rank}</span>
                            <span className="text-sm text-muted-foreground font-normal">of {leaderboardData.length}</span>
                          </div>
                          
                          <div className="text-sm text-muted-foreground mt-1">
                            <span>{userRank.points} points · {userRank.tasksCompleted} tasks completed</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Leaderboard Stats */}
                  <Card className="col-span-2">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Top Stats</CardTitle>
                      <CardDescription>Overall performance metrics</CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-md bg-yellow-500/20 text-yellow-500">
                          <Crown className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-bold text-xl">
                            {leaderboardData[0].name}
                          </h4>
                          <p className="text-muted-foreground text-sm">Top Performer</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-md bg-blue-500/20 text-blue-500">
                          <Zap className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-bold text-xl">
                            {leaderboardData.reduce((a, b) => a.tasksCompleted > b.tasksCompleted ? a : b).name}
                          </h4>
                          <p className="text-muted-foreground text-sm">Most Active</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-md bg-green-500/20 text-green-500">
                          <Music className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-bold text-xl">
                            {leaderboardData.reduce((a, b) => a.points > b.points ? a : b).name}
                          </h4>
                          <p className="text-muted-foreground text-sm">Music Lover</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-md bg-purple-500/20 text-purple-500">
                          <Users className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-bold text-xl">
                            {leaderboardData.length}
                          </h4>
                          <p className="text-muted-foreground text-sm">Total Members</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
                
                {/* Tabs for different leaderboards */}
                <Tabs defaultValue="points" className="w-full">
                  <TabsList className="mb-4">
                    <TabsTrigger value="points">Points</TabsTrigger>
                    <TabsTrigger value="tasks">Tasks Completed</TabsTrigger>
                    <TabsTrigger value="referrals">Referrals</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="points" className="m-0">
                    {/* Top 3 users */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      {[1, 2, 3].map(rank => {
                        const user = leaderboardData[rank - 1];
                        return (
                          <Card key={rank} className="bg-muted/50">
                            <CardHeader className="text-center">
                              <div className="flex justify-center">
                                {getRankIcon(rank)}
                              </div>
                              <CardTitle className="text-xl font-bold mt-2">{user.name}</CardTitle>
                              <CardDescription className="text-sm text-muted-foreground">
                                {user.points} points
                              </CardDescription>
                            </CardHeader>
                            <CardContent className="text-center">
                              <Avatar className="h-14 w-14 mx-auto">
                                <AvatarImage src={user.avatarUrl} alt={user.name} />
                                <AvatarFallback className="bg-sound-light text-white">
                                  {user.initials}
                                </AvatarFallback>
                              </Avatar>
                              <p className="text-sm text-muted-foreground mt-2">
                                {user.tasksCompleted} tasks completed
                              </p>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                    
                    <Card className="mt-6">
                      <CardHeader className="pb-0">
                        <div className="flex justify-between items-center">
                          <CardTitle>Points Leaderboard</CardTitle>
                          <Select value={filterPeriod} onValueChange={setFilterPeriod}>
                            <SelectTrigger className="w-[180px]">
                              <SelectValue placeholder="Select period" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="daily">Daily</SelectItem>
                              <SelectItem value="weekly">Weekly</SelectItem>
                              <SelectItem value="monthly">Monthly</SelectItem>
                              <SelectItem value="alltime">All Time</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <motion.div
                          variants={staggerContainer}
                          initial="hidden"
                          animate="visible"
                          className="mt-4 space-y-2"
                        >
                          {leaderboardData.map((user, index) => (
                            <motion.div
                              key={index}
                              variants={fadeInUp}
                              className={`flex items-center p-3 rounded-lg ${currentUserEntry?.id === user.id ? 'bg-muted/50 border border-sound-light/20' : 'hover:bg-muted/30'}`}
                            >
                              <div className="w-8 flex justify-center">
                                {getRankIcon(index + 1)}
                              </div>
                              
                              <div className="flex items-center flex-1 ml-2">
                                <Avatar className="h-10 w-10 mr-3">
                                  <AvatarImage src={user.avatarUrl} alt={user.name} />
                                  <AvatarFallback className="bg-sound-light text-white">
                                    {user.initials}
                                  </AvatarFallback>
                                </Avatar>
                                
                                <div>
                                  <div className="flex items-center">
                                    <h3 className="font-medium text-sm">
                                      {user.name}
                                      {currentUserEntry?.id === user.id && (
                                        <span className="text-xs ml-2 text-muted-foreground">(You)</span>
                                      )}
                                    </h3>
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    {user.tasksCompleted} tasks completed
                                  </div>
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-2">
                                {user.tier === "Premium" && (
                                  <Badge className="bg-sound-light">Premium</Badge>
                                )}
                                {user.status === "Influencer" && (
                                  <Badge className="bg-purple-500">Influencer</Badge>
                                )}
                                
                                <div className="text-right">
                                  <div className="font-bold">{user.points}</div>
                                  <div className="text-xs text-muted-foreground">points</div>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </motion.div>
                        
                        <Button variant="ghost" className="w-full mt-4">
                          <span>View Full Leaderboard</span>
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="tasks" className="m-0">
                    <Card className="mt-6">
                      <CardHeader className="pb-0">
                        <div className="flex justify-between items-center">
                          <CardTitle>Tasks Completed Leaderboard</CardTitle>
                          <Select value={filterPeriod} onValueChange={setFilterPeriod}>
                            <SelectTrigger className="w-[180px]">
                              <SelectValue placeholder="Select period" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="daily">Daily</SelectItem>
                              <SelectItem value="weekly">Weekly</SelectItem>
                              <SelectItem value="monthly">Monthly</SelectItem>
                              <SelectItem value="alltime">All Time</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <motion.div
                          variants={staggerContainer}
                          initial="hidden"
                          animate="visible"
                          className="mt-4 space-y-2"
                        >
                          {leaderboardData.sort((a, b) => b.tasksCompleted - a.tasksCompleted).map((user, index) => (
                            <motion.div
                              key={index}
                              variants={fadeInUp}
                              className={`flex items-center p-3 rounded-lg ${currentUserEntry?.id === user.id ? 'bg-muted/50 border border-sound-light/20' : 'hover:bg-muted/30'}`}
                            >
                              <div className="w-8 flex justify-center">
                                {getRankIcon(index + 1)}
                              </div>
                              
                              <div className="flex items-center flex-1 ml-2">
                                <Avatar className="h-10 w-10 mr-3">
                                  <AvatarImage src={user.avatarUrl} alt={user.name} />
                                  <AvatarFallback className="bg-sound-light text-white">
                                    {user.initials}
                                  </AvatarFallback>
                                </Avatar>
                                
                                <div>
                                  <div className="flex items-center">
                                    <h3 className="font-medium text-sm">
                                      {user.name}
                                      {currentUserEntry?.id === user.id && (
                                        <span className="text-xs ml-2 text-muted-foreground">(You)</span>
                                      )}
                                    </h3>
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    {user.points} points
                                  </div>
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-2">
                                {user.tier === "Premium" && (
                                  <Badge className="bg-sound-light">Premium</Badge>
                                )}
                                {user.status === "Influencer" && (
                                  <Badge className="bg-purple-500">Influencer</Badge>
                                )}
                                
                                <div className="text-right">
                                  <div className="font-bold">{user.tasksCompleted}</div>
                                  <div className="text-xs text-muted-foreground">tasks</div>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </motion.div>
                        
                        <Button variant="ghost" className="w-full mt-4">
                          <span>View Full Leaderboard</span>
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="referrals" className="m-0">
                    <Card className="mt-6">
                      <CardHeader className="pb-0">
                        <div className="flex justify-between items-center">
                          <CardTitle>Referrals Leaderboard</CardTitle>
                          <Select value={filterPeriod} onValueChange={setFilterPeriod}>
                            <SelectTrigger className="w-[180px]">
                              <SelectValue placeholder="Select period" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="daily">Daily</SelectItem>
                              <SelectItem value="weekly">Weekly</SelectItem>
                              <SelectItem value="monthly">Monthly</SelectItem>
                              <SelectItem value="alltime">All Time</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <motion.div
                          variants={staggerContainer}
                          initial="hidden"
                          animate="visible"
                          className="mt-4 space-y-2"
                        >
                          {leaderboardData.sort((a, b) => 0.5 - Math.random()).map((user, index) => (
                            <motion.div
                              key={index}
                              variants={fadeInUp}
                              className={`flex items-center p-3 rounded-lg ${currentUserEntry?.id === user.id ? 'bg-muted/50 border border-sound-light/20' : 'hover:bg-muted/30'}`}
                            >
                              <div className="w-8 flex justify-center">
                                {getRankIcon(index + 1)}
                              </div>
                              
                              <div className="flex items-center flex-1 ml-2">
                                <Avatar className="h-10 w-10 mr-3">
                                  <AvatarImage src={user.avatarUrl} alt={user.name} />
                                  <AvatarFallback className="bg-sound-light text-white">
                                    {user.initials}
                                  </AvatarFallback>
                                </Avatar>
                                
                                <div>
                                  <div className="flex items-center">
                                    <h3 className="font-medium text-sm">
                                      {user.name}
                                      {currentUserEntry?.id === user.id && (
                                        <span className="text-xs ml-2 text-muted-foreground">(You)</span>
                                      )}
                                    </h3>
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    {user.points} points
                                  </div>
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-2">
                                {user.tier === "Premium" && (
                                  <Badge className="bg-sound-light">Premium</Badge>
                                )}
                                {user.status === "Influencer" && (
                                  <Badge className="bg-purple-500">Influencer</Badge>
                                )}
                                
                                <div className="text-right">
                                  <div className="font-bold">{Math.floor(Math.random() * 50)}</div>
                                  <div className="text-xs text-muted-foreground">referrals</div>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </motion.div>
                        
                        <Button variant="ghost" className="w-full mt-4">
                          <span>View Full Leaderboard</span>
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                      </CardContent>
                    </Card>
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

export default Leaderboard;

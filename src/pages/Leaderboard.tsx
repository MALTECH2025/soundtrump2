
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { AnimatedTransition } from '@/components/ui/AnimatedTransition';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Crown, Users, Trophy, Award } from 'lucide-react';
import { fetchLeaderboard } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { useProfile } from '@/context/ProfileContext';
import { LeaderboardUser } from '@/types';

const Leaderboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated, user: authUser } = useAuth();
  const { user } = useProfile();
  
  const { data: leaderboardUsers = [], isLoading: leaderboardLoading } = useQuery({
    queryKey: ['leaderboard'],
    queryFn: fetchLeaderboard,
    enabled: isAuthenticated,
  });
  
  useEffect(() => {
    if (!leaderboardLoading) {
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [leaderboardLoading]);
  
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };
  
  const topUsers = leaderboardUsers.slice(0, 3);
  const restUsers = leaderboardUsers.slice(3);
  
  const userPosition = leaderboardUsers.findIndex(lbUser => lbUser.id === authUser?.id) + 1;
  
  return (
    <AnimatedTransition>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        
        <main className="flex-grow pt-24 pb-12">
          <div className="container px-4 mx-auto">
            {isLoading ? (
              <div className="animate-pulse">
                <div className="h-8 bg-muted w-1/3 mb-6 rounded"></div>
                <div className="flex justify-center gap-6 mb-12">
                  <div className="w-1/4 h-64 bg-muted rounded-lg"></div>
                  <div className="w-1/4 h-72 bg-muted rounded-lg"></div>
                  <div className="w-1/4 h-64 bg-muted rounded-lg"></div>
                </div>
                <div className="h-6 bg-muted w-1/4 mb-6 rounded"></div>
                <div className="space-y-4">
                  <div className="h-20 bg-muted rounded-lg"></div>
                  <div className="h-20 bg-muted rounded-lg"></div>
                  <div className="h-20 bg-muted rounded-lg"></div>
                </div>
              </div>
            ) : (
              <>
                <motion.div
                  variants={fadeInUp}
                  initial="hidden"
                  animate="visible"
                  className="mb-6 text-center"
                >
                  <h1 className="text-3xl font-bold mb-2">Leaderboard</h1>
                  <p className="text-muted-foreground max-w-lg mx-auto">See where you rank among other users. Complete more tasks to earn points and climb the leaderboard!</p>
                </motion.div>
                
                {leaderboardUsers.length === 0 ? (
                  <div className="text-center mt-12">
                    <p className="text-xl">No leaderboard data available yet</p>
                    <p className="text-muted-foreground mt-2">Complete tasks to be the first on the leaderboard!</p>
                  </div>
                ) : (
                  <>
                    <motion.div
                      variants={fadeInUp}
                      initial="hidden"
                      animate="visible"
                      className="flex flex-col md:flex-row justify-center items-end gap-4 md:gap-8 mt-8 mb-16"
                    >
                      {topUsers.length >= 3 && (
                        <div className="relative w-full max-w-[240px] order-1 md:order-1">
                          <Card className="border-2 p-4 text-center">
                            <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 bg-amber-500 rounded-full p-2">
                              <Trophy className="h-6 w-6 text-white" />
                            </div>
                            <CardContent className="pt-6">
                              <Avatar className="h-20 w-20 mx-auto mb-4 border-4 border-amber-200">
                                {topUsers[2].avatar_url ? (
                                  <AvatarImage src={topUsers[2].avatar_url} alt="User avatar" />
                                ) : (
                                  <AvatarFallback className="text-2xl">{topUsers[2].initials}</AvatarFallback>
                                )}
                              </Avatar>
                              <h3 className="font-bold text-xl mb-1">{topUsers[2].full_name || topUsers[2].username || "User"}</h3>
                              <div className="flex justify-center items-center">
                                <Badge className="bg-amber-500">3rd Place</Badge>
                              </div>
                              <p className="mt-4 text-lg font-semibold">{topUsers[2].points.toLocaleString()} Points</p>
                            </CardContent>
                          </Card>
                        </div>
                      )}
                      
                      {topUsers.length >= 1 && (
                        <div className="relative w-full max-w-[280px] order-0 md:order-0 z-10">
                          <Card className="border-2 border-yellow-400 p-4 text-center">
                            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-yellow-400 rounded-full p-2">
                              <Crown className="h-8 w-8 text-white" />
                            </div>
                            <CardContent className="pt-8">
                              <Avatar className="h-24 w-24 mx-auto mb-4 border-4 border-yellow-200">
                                {topUsers[0].avatar_url ? (
                                  <AvatarImage src={topUsers[0].avatar_url} alt="User avatar" />
                                ) : (
                                  <AvatarFallback className="text-3xl">{topUsers[0].initials}</AvatarFallback>
                                )}
                              </Avatar>
                              <h3 className="font-bold text-2xl mb-1">{topUsers[0].full_name || topUsers[0].username || "User"}</h3>
                              <div className="flex justify-center items-center">
                                <Badge className="bg-yellow-400 text-black">1st Place</Badge>
                                {topUsers[0].status === "Influencer" && (
                                  <Badge className="ml-2 bg-purple-500">Influencer</Badge>
                                )}
                              </div>
                              <p className="mt-4 text-xl font-semibold">{topUsers[0].points.toLocaleString()} Points</p>
                            </CardContent>
                          </Card>
                        </div>
                      )}
                      
                      {topUsers.length >= 2 && (
                        <div className="relative w-full max-w-[240px] order-2 md:order-2">
                          <Card className="border-2 p-4 text-center">
                            <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 bg-gray-400 rounded-full p-2">
                              <Award className="h-6 w-6 text-white" />
                            </div>
                            <CardContent className="pt-6">
                              <Avatar className="h-20 w-20 mx-auto mb-4 border-4 border-gray-200">
                                {topUsers[1].avatar_url ? (
                                  <AvatarImage src={topUsers[1].avatar_url} alt="User avatar" />
                                ) : (
                                  <AvatarFallback className="text-2xl">{topUsers[1].initials}</AvatarFallback>
                                )}
                              </Avatar>
                              <h3 className="font-bold text-xl mb-1">{topUsers[1].full_name || topUsers[1].username || "User"}</h3>
                              <div className="flex justify-center items-center">
                                <Badge className="bg-gray-400">2nd Place</Badge>
                              </div>
                              <p className="mt-4 text-lg font-semibold">{topUsers[1].points.toLocaleString()} Points</p>
                            </CardContent>
                          </Card>
                        </div>
                      )}
                    </motion.div>
                    
                    <motion.div
                      variants={fadeInUp}
                      initial="hidden"
                      animate="visible"
                      className="mt-10"
                    >
                      <h2 className="text-xl font-bold mb-4">All Users</h2>
                      <div className="space-y-3">
                        {leaderboardUsers.map((lbUser) => (
                          <Card 
                            key={lbUser.id} 
                            className={`${lbUser.id === authUser?.id ? 'border-2 border-sound-light' : ''}`}
                          >
                            <CardContent className="p-4 flex items-center">
                              <div className="w-8 font-bold text-lg">{lbUser.position}</div>
                              <Avatar className="h-10 w-10 mr-4">
                                {lbUser.avatar_url ? (
                                  <AvatarImage src={lbUser.avatar_url} alt="User avatar" />
                                ) : (
                                  <AvatarFallback>{lbUser.initials}</AvatarFallback>
                                )}
                              </Avatar>
                              <div className="flex-1">
                                <div className="font-medium">{lbUser.full_name || lbUser.username || "User"}</div>
                                <div className="flex mt-1">
                                  {lbUser.tier === "Premium" && (
                                    <Badge variant="outline" className="text-xs mr-1">Premium</Badge>
                                  )}
                                  {lbUser.status === "Influencer" && (
                                    <Badge className="bg-purple-500 text-xs">Influencer</Badge>
                                  )}
                                </div>
                              </div>
                              <div className="font-bold">{lbUser.points.toLocaleString()} Points</div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </motion.div>
                    
                    {userPosition > 0 && (
                      <motion.div
                        variants={fadeInUp}
                        initial="hidden"
                        animate="visible"
                        className="mt-8"
                      >
                        <Card className="border border-sound-light bg-sound-light/5">
                          <CardContent className="p-6 flex flex-col items-center text-center">
                            <h3 className="text-xl font-bold mb-3">Your Position</h3>
                            <div className="font-bold text-3xl mb-2">{userPosition}{getOrdinalSuffix(userPosition)}</div>
                            <p className="text-sm text-muted-foreground">Complete more tasks to climb the leaderboard!</p>
                          </CardContent>
                        </Card>
                      </motion.div>
                    )}
                  </>
                )}
              </>
            )}
          </div>
        </main>
        
        <Footer />
      </div>
    </AnimatedTransition>
  );
};

// Helper function to get ordinal suffix for numbers (1st, 2nd, 3rd, etc.)
function getOrdinalSuffix(n: number) {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return s[(v - 20) % 10] || s[v] || s[0];
}

export default Leaderboard;

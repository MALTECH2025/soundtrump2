
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Crown, Trophy, Medal, Star, Users } from 'lucide-react';
import { AnimatedTransition } from '@/components/ui/AnimatedTransition';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/context/AuthContext';
import { fetchLeaderboard, getUserRank } from '@/lib/api/leaderboard';

const Leaderboard = () => {
  const { isAuthenticated, user: authUser } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState('all-time');

  const { data: leaderboard = [], isLoading } = useQuery({
    queryKey: ['leaderboard', selectedPeriod],
    queryFn: () => fetchLeaderboard(100),
    enabled: isAuthenticated,
  });

  const { data: userRank } = useQuery({
    queryKey: ['userRank', authUser?.id],
    queryFn: () => getUserRank(authUser?.id || ''),
    enabled: isAuthenticated && !!authUser?.id,
  });

  const getRankIcon = (position: number) => {
    switch (position) {
      case 1:
        return <Crown className="w-5 h-5 text-yellow-500" />;
      case 2:
        return <Trophy className="w-5 h-5 text-gray-400" />;
      case 3:
        return <Medal className="w-5 h-5 text-amber-600" />;
      default:
        return <span className="w-5 h-5 text-center text-sm font-bold text-foreground">#{position}</span>;
    }
  };

  const getTierBadge = (tier: string) => {
    const variant = tier === 'Premium' ? 'default' : 'secondary';
    return <Badge variant={variant}>{tier}</Badge>;
  };

  const getStatusBadge = (status: string) => {
    if (status === 'Influencer') {
      return (
        <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-800">
          <Star className="w-3 h-3 mr-1" />
          Influencer
        </Badge>
      );
    }
    return null;
  };

  if (!isAuthenticated) {
    return (
      <AnimatedTransition>
        <div className="min-h-screen flex flex-col bg-background">
          <Navbar />
          <main className="flex-grow pt-24 pb-12 flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-2xl font-bold mb-4 text-foreground">Please log in to view the leaderboard</h1>
              <p className="text-muted-foreground">Sign in to your account to see where you rank!</p>
            </div>
          </main>
          <Footer />
        </div>
      </AnimatedTransition>
    );
  }

  return (
    <AnimatedTransition>
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        
        <main className="flex-grow pt-24 pb-12">
          <div className="container px-4 mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-6"
            >
              <h1 className="text-3xl font-bold mb-2 flex items-center gap-2 text-foreground">
                <Trophy className="w-8 h-8 text-yellow-500" />
                Leaderboard
              </h1>
              <p className="text-muted-foreground">See how you rank against other SoundTrump users</p>
              {userRank && (
                <p className="text-sm text-muted-foreground mt-2">
                  Your current rank: <span className="font-semibold text-foreground">#{userRank}</span>
                </p>
              )}
            </motion.div>

            <Tabs defaultValue="all-time" className="w-full">
              <TabsList className="mb-6 bg-muted">
                <TabsTrigger value="all-time" className="text-foreground data-[state=active]:bg-background data-[state=active]:text-foreground">All Time</TabsTrigger>
                <TabsTrigger value="monthly" className="text-foreground data-[state=active]:bg-background data-[state=active]:text-foreground">This Month</TabsTrigger>
                <TabsTrigger value="weekly" className="text-foreground data-[state=active]:bg-background data-[state=active]:text-foreground">This Week</TabsTrigger>
              </TabsList>

              <TabsContent value="all-time">
                <div className="grid gap-4">
                  {/* Top 3 Podium */}
                  {leaderboard.length >= 3 && (
                    <Card className="mb-6 bg-card border-border">
                      <CardHeader>
                        <CardTitle className="text-center text-foreground">Top Performers</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex justify-center items-end gap-8">
                          {/* 2nd Place */}
                          <motion.div 
                            className="text-center"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                          >
                            <div className="bg-muted/50 rounded-lg p-4 h-32 flex flex-col justify-end">
                              <Avatar className="w-12 h-12 mx-auto mb-2">
                                <AvatarImage src={leaderboard[1].avatar_url || ''} />
                                <AvatarFallback className="bg-primary/10 text-primary">{leaderboard[1].initials}</AvatarFallback>
                              </Avatar>
                              <Trophy className="w-6 h-6 text-gray-400 mx-auto mb-1" />
                              <p className="font-semibold text-sm text-foreground">{leaderboard[1].username || leaderboard[1].full_name}</p>
                              <p className="text-xs text-muted-foreground">{leaderboard[1].points.toLocaleString()} ST</p>
                            </div>
                          </motion.div>

                          {/* 1st Place */}
                          <motion.div 
                            className="text-center"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0 }}
                          >
                            <div className="bg-yellow-100 dark:bg-yellow-900/30 rounded-lg p-4 h-40 flex flex-col justify-end">
                              <Avatar className="w-16 h-16 mx-auto mb-2">
                                <AvatarImage src={leaderboard[0].avatar_url || ''} />
                                <AvatarFallback className="bg-yellow-500/20 text-yellow-700 dark:text-yellow-300">{leaderboard[0].initials}</AvatarFallback>
                              </Avatar>
                              <Crown className="w-8 h-8 text-yellow-500 mx-auto mb-1" />
                              <p className="font-bold text-foreground">{leaderboard[0].username || leaderboard[0].full_name}</p>
                              <p className="text-sm text-muted-foreground">{leaderboard[0].points.toLocaleString()} ST</p>
                            </div>
                          </motion.div>

                          {/* 3rd Place */}
                          <motion.div 
                            className="text-center"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                          >
                            <div className="bg-amber-100 dark:bg-amber-900/30 rounded-lg p-4 h-28 flex flex-col justify-end">
                              <Avatar className="w-10 h-10 mx-auto mb-2">
                                <AvatarImage src={leaderboard[2].avatar_url || ''} />
                                <AvatarFallback className="bg-amber-500/20 text-amber-700 dark:text-amber-300">{leaderboard[2].initials}</AvatarFallback>
                              </Avatar>
                              <Medal className="w-5 h-5 text-amber-600 mx-auto mb-1" />
                              <p className="font-semibold text-xs text-foreground">{leaderboard[2].username || leaderboard[2].full_name}</p>
                              <p className="text-xs text-muted-foreground">{leaderboard[2].points.toLocaleString()} ST</p>
                            </div>
                          </motion.div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Full Leaderboard */}
                  <Card className="bg-card border-border">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-foreground">
                        <Users className="w-5 h-5" />
                        All Users ({leaderboard.length})
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {isLoading ? (
                        <div className="space-y-4">
                          {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="flex items-center gap-4 p-4 animate-pulse">
                              <div className="w-8 h-8 bg-muted rounded"></div>
                              <div className="w-12 h-12 bg-muted rounded-full"></div>
                              <div className="flex-1 space-y-2">
                                <div className="h-4 bg-muted rounded w-1/4"></div>
                                <div className="h-3 bg-muted rounded w-1/6"></div>
                              </div>
                              <div className="h-4 bg-muted rounded w-20"></div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {leaderboard.map((user, index) => (
                            <motion.div
                              key={user.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.05 }}
                              className={`flex items-center gap-4 p-4 rounded-lg transition-colors ${
                                user.id === authUser?.id 
                                  ? 'bg-primary/10 border-2 border-primary/20' 
                                  : 'hover:bg-muted/50'
                              }`}
                            >
                              <div className="flex-shrink-0 w-8">
                                {getRankIcon(user.position)}
                              </div>
                              
                              <Avatar className="w-12 h-12">
                                <AvatarImage src={user.avatar_url || ''} />
                                <AvatarFallback className="bg-primary/10 text-primary">{user.initials}</AvatarFallback>
                              </Avatar>
                              
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <p className="font-semibold truncate text-foreground">
                                    {user.username || user.full_name || `User ${user.id.slice(0, 8)}`}
                                  </p>
                                  {user.id === authUser?.id && (
                                    <Badge variant="outline" className="text-xs">You</Badge>
                                  )}
                                </div>
                                <div className="flex items-center gap-2 mt-1">
                                  {getTierBadge(user.tier)}
                                  {getStatusBadge(user.status)}
                                </div>
                              </div>
                              
                              <div className="text-right">
                                <p className="font-bold text-lg text-foreground">{user.points.toLocaleString()}</p>
                                <p className="text-xs text-muted-foreground">ST Coins</p>
                              </div>
                            </motion.div>
                          ))}
                          
                          {leaderboard.length === 0 && (
                            <div className="text-center py-12">
                              <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                              <p className="text-muted-foreground">No users found</p>
                            </div>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="monthly">
                <Card className="bg-card border-border">
                  <CardContent className="py-12 text-center">
                    <p className="text-muted-foreground">Monthly leaderboard coming soon!</p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="weekly">
                <Card className="bg-card border-border">
                  <CardContent className="py-12 text-center">
                    <p className="text-muted-foreground">Weekly leaderboard coming soon!</p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
        
        <Footer />
      </div>
    </AnimatedTransition>
  );
};

export default Leaderboard;

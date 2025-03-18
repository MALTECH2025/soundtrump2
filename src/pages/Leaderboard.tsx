
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Diamond, Search, Trophy, Medal, Award, User, Filter } from 'lucide-react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AnimatedTransition from '@/components/ui/AnimatedTransition';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useAuth } from '@/context/AuthContext';

interface Rank {
  id: number;
  name: string;
  color: string;
  shadow: string;
  points: number;
  description: string;
}

interface LeaderboardUser {
  id: string;
  name: string;
  points: number;
  rank: number;
  rankName: string;
  isInfluencer: boolean;
  isPremium: boolean;
}

const ranks: Rank[] = [
  { id: 1, name: 'Crystal I', color: '#B9F2FF', shadow: '#77D1E6', points: 0, description: 'Beginning of the journey' },
  { id: 2, name: 'Crystal II', color: '#A0E9FF', shadow: '#62C9E6', points: 1000, description: 'Active listener' },
  { id: 3, name: 'Crystal III', color: '#87E0FF', shadow: '#4DB4E6', points: 2500, description: 'Rising star' },
  { id: 4, name: 'Crystal IV', color: '#6DD7FF', shadow: '#389FE6', points: 5000, description: 'Sound enthusiast' },
  { id: 5, name: 'Crystal V', color: '#54CEFF', shadow: '#248AE6', points: 10000, description: 'Music connoisseur' },
  { id: 6, name: 'Crystal VI', color: '#3AC6FF', shadow: '#1075E6', points: 20000, description: 'Dedicated supporter' },
  { id: 7, name: 'Crystal VII', color: '#21BDFF', shadow: '#0060E6', points: 35000, description: 'Music ambassador' },
  { id: 8, name: 'Crystal VIII', color: '#08B4FF', shadow: '#004BE6', points: 50000, description: 'Streaming legend' },
  { id: 9, name: 'Crystal IX', color: '#00ABFF', shadow: '#0036E6', points: 75000, description: 'Elite listener' },
  { id: 10, name: 'Crystal X', color: '#00A2FF', shadow: '#0021E6', points: 100000, description: 'Sound immortal' },
];

// Generate mock leaderboard data
const generateMockUsers = (): LeaderboardUser[] => {
  const users: LeaderboardUser[] = [];
  
  for (let i = 1; i <= 50; i++) {
    const points = Math.floor(100000 / i) + Math.floor(Math.random() * 1000);
    const rankId = ranks.findIndex(rank => points >= rank.points);
    const rankIndex = rankId === -1 ? 0 : rankId;
    
    users.push({
      id: `user-${i}`,
      name: `User ${i}`,
      points,
      rank: rankIndex + 1,
      rankName: ranks[rankIndex].name,
      isInfluencer: Math.random() > 0.8,
      isPremium: Math.random() > 0.6
    });
  }
  
  return users.sort((a, b) => b.points - a.points);
};

const Leaderboard = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('global');
  const [users] = useState<LeaderboardUser[]>(generateMockUsers());
  
  // Find the current user in the leaderboard
  const currentUserIndex = users.findIndex(u => u.name.toLowerCase() === (user?.name || '').toLowerCase());
  const currentUserRank = currentUserIndex !== -1 ? currentUserIndex + 1 : null;
  
  // Filter users based on search term
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };
  
  const renderRankBadge = (rankId: number) => {
    const rank = ranks[rankId - 1];
    
    return (
      <div className="flex items-center">
        <Diamond 
          fill={rank.color} 
          stroke={rank.shadow} 
          strokeWidth={1} 
          className="h-5 w-5 mr-1.5 drop-shadow" 
        />
        <span>{rank.name}</span>
      </div>
    );
  };
  
  return (
    <AnimatedTransition>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        
        <main className="flex-grow pt-24 pb-12">
          <div className="container px-4 mx-auto">
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              className="mb-6"
            >
              <h1 className="text-3xl font-bold">Leaderboard</h1>
              <p className="text-muted-foreground">See how you rank against other music enthusiasts</p>
            </motion.div>
            
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              <div className="lg:col-span-3">
                <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full sm:w-auto">
                    <TabsList>
                      <TabsTrigger value="global">Global</TabsTrigger>
                      <TabsTrigger value="friends">Friends</TabsTrigger>
                      <TabsTrigger value="country">Country</TabsTrigger>
                    </TabsList>
                  </Tabs>
                  
                  <div className="w-full sm:w-auto flex items-center space-x-2">
                    <div className="relative flex-grow">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input 
                        type="search" 
                        placeholder="Search users..." 
                        className="pl-8 w-full sm:w-[250px]"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <Button variant="outline" size="icon">
                      <Filter className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle>Top SoundTrump Users</CardTitle>
                    <CardDescription>
                      Users are ranked based on total ST Coins earned
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[80px]">Rank</TableHead>
                          <TableHead>User</TableHead>
                          <TableHead>Rank Level</TableHead>
                          <TableHead className="text-right">Points</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredUsers.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                              No users found matching your search.
                            </TableCell>
                          </TableRow>
                        ) : (
                          filteredUsers.slice(0, 20).map((leaderboardUser, index) => (
                            <TableRow 
                              key={leaderboardUser.id}
                              className={leaderboardUser.name.toLowerCase() === (user?.name || '').toLowerCase() ? "bg-muted/40" : ""}
                            >
                              <TableCell>
                                {index === 0 ? (
                                  <Trophy className="h-5 w-5 text-amber-500" />
                                ) : index === 1 ? (
                                  <Medal className="h-5 w-5 text-gray-400" />
                                ) : index === 2 ? (
                                  <Medal className="h-5 w-5 text-amber-700" />
                                ) : (
                                  <span className="font-mono">{index + 1}</span>
                                )}
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center">
                                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center mr-2 text-xs">
                                    <User className="h-4 w-4" />
                                  </div>
                                  <div>
                                    <div className="font-medium flex items-center gap-1.5">
                                      {leaderboardUser.name}
                                      {leaderboardUser.name.toLowerCase() === (user?.name || '').toLowerCase() && (
                                        <Badge variant="outline" className="text-xs ml-1">(You)</Badge>
                                      )}
                                    </div>
                                    <div className="flex gap-1.5">
                                      {leaderboardUser.isPremium && (
                                        <Badge variant="outline" className="bg-sound-light/10 text-sound-light border-sound-light/20 text-[10px]">
                                          Premium
                                        </Badge>
                                      )}
                                      {leaderboardUser.isInfluencer && (
                                        <Badge variant="outline" className="bg-purple-500/10 text-purple-500 border-purple-500/20 text-[10px]">
                                          Influencer
                                        </Badge>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                {renderRankBadge(leaderboardUser.rank)}
                              </TableCell>
                              <TableCell className="text-right font-mono">
                                {leaderboardUser.points.toLocaleString()} ST
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                    
                    {filteredUsers.length > 20 && (
                      <div className="pt-4 text-center">
                        <Button variant="outline">Load More</Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                {currentUserRank && currentUserRank > 20 && searchTerm === '' && (
                  <div className="mt-6">
                    <Card>
                      <CardContent className="p-4">
                        <div className="font-medium text-sm mb-2">Your Position</div>
                        <Table>
                          <TableBody>
                            <TableRow className="bg-muted/40">
                              <TableCell className="w-[80px]">
                                <span className="font-mono">{currentUserRank}</span>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center">
                                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center mr-2 text-xs">
                                    <User className="h-4 w-4" />
                                  </div>
                                  <div>
                                    <div className="font-medium flex items-center">
                                      {user?.name}
                                      <Badge variant="outline" className="text-xs ml-1.5">(You)</Badge>
                                    </div>
                                    <div className="flex gap-1.5">
                                      {user?.role.tier === "Premium" && (
                                        <Badge variant="outline" className="bg-sound-light/10 text-sound-light border-sound-light/20 text-[10px]">
                                          Premium
                                        </Badge>
                                      )}
                                      {user?.role.status === "Influencer" && (
                                        <Badge variant="outline" className="bg-purple-500/10 text-purple-500 border-purple-500/20 text-[10px]">
                                          Influencer
                                        </Badge>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                {currentUserIndex !== -1 && renderRankBadge(users[currentUserIndex].rank)}
                              </TableCell>
                              <TableCell className="text-right font-mono">
                                {currentUserIndex !== -1 && users[currentUserIndex].points.toLocaleString()} ST
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>
              
              <div className="lg:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle>Rank Levels</CardTitle>
                    <CardDescription>
                      SoundTrump has 10 rank levels based on your earned points
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {ranks.map((rank) => (
                        <div 
                          key={rank.id} 
                          className="flex justify-between items-center p-3 rounded-md border border-border"
                        >
                          <div className="flex items-center">
                            <Diamond 
                              fill={rank.color} 
                              stroke={rank.shadow} 
                              strokeWidth={1} 
                              className="h-5 w-5 mr-2 drop-shadow" 
                            />
                            <div>
                              <div className="font-medium text-sm">{rank.name}</div>
                              <div className="text-xs text-muted-foreground">{rank.description}</div>
                            </div>
                          </div>
                          <div className="text-xs font-mono">
                            {rank.points.toLocaleString()} ST
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    </AnimatedTransition>
  );
};

export default Leaderboard;

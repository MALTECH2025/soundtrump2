
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import AnimatedTransition from '@/components/ui/AnimatedTransition';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { 
  Users, 
  Share, 
  Copy, 
  Award, 
  ChevronRight, 
  CheckCircle2, 
  Twitter, 
  Facebook, 
  Mail, 
  MessageCircle, 
  Link, 
  AlertTriangle 
} from 'lucide-react';
import { toast } from '@/components/ui/sonner';

// Mock referral data
const referrals = [
  { id: '1', name: 'Emma Johnson', date: '2023-10-15T14:30:00', status: 'active', reward: 10 },
  { id: '2', name: 'Liam Williams', date: '2023-10-14T09:15:00', status: 'active', reward: 10 },
  { id: '3', name: 'Noah Brown', date: '2023-10-12T17:45:00', status: 'active', reward: 10 },
  { id: '4', name: 'Olivia Davis', date: '2023-10-10T11:20:00', status: 'active', reward: 10 },
  { id: '5', name: 'James Miller', date: '2023-10-08T13:10:00', status: 'active', reward: 10 },
  { id: '6', name: 'Sophia Wilson', date: '2023-10-05T16:30:00', status: 'active', reward: 10 },
  { id: '7', name: 'Benjamin Moore', date: '2023-10-03T10:45:00', status: 'active', reward: 10 },
  { id: '8', name: 'Charlotte Taylor', date: '2023-10-01T15:20:00', status: 'active', reward: 10 },
  { id: '9', name: 'Lucas Anderson', date: '2023-09-28T12:15:00', status: 'pending', reward: 10 },
  { id: '10', name: 'Ava Thomas', date: '2023-09-25T14:50:00', status: 'pending', reward: 10 },
];

const Referrals = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [referralCode, setReferralCode] = useState('SOUNDFAN2024');
  const [referralLink, setReferralLink] = useState('https://soundtrump.com/ref/SOUNDFAN2024');
  const [userProfile, setUserProfile] = useState({
    name: 'Alex Johnson',
    avatar: '',
    initials: 'AJ'
  });
  const [isCopied, setIsCopied] = useState(false);
  
  // Stats
  const totalReferrals = 42;
  const activeReferrals = 38;
  const pendingReferrals = 4;
  const earnedFromReferrals = 420;
  const influencerThreshold = 500;
  const referralProgress = Math.min((totalReferrals / influencerThreshold) * 100, 100);
  const isInfluencer = false;
  
  // Copy referral link or code to clipboard
  const copyToClipboard = (text: string, type: 'link' | 'code') => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    toast.success(`${type === 'link' ? 'Referral link' : 'Referral code'} copied to clipboard!`);
    
    // Reset copied state after 2 seconds
    setTimeout(() => setIsCopied(false), 2000);
  };
  
  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="h-48 bg-muted rounded-lg"></div>
                  <div className="h-48 bg-muted rounded-lg"></div>
                  <div className="h-48 bg-muted rounded-lg"></div>
                </div>
                <div className="h-6 bg-muted w-1/4 mb-6 rounded"></div>
                <div className="h-64 bg-muted rounded-lg w-full"></div>
              </div>
            ) : (
              <>
                {/* Header */}
                <motion.div
                  variants={fadeInUp}
                  initial="hidden"
                  animate="visible"
                  className="mb-6"
                >
                  <h1 className="text-3xl font-bold mb-2">Referral Program</h1>
                  <p className="text-muted-foreground">Invite friends to SoundTrump and earn rewards for each successful referral</p>
                </motion.div>
                
                {/* Stats cards */}
                <motion.div 
                  variants={staggerContainer}
                  initial="hidden"
                  animate="visible"
                  className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
                >
                  {/* Total Referrals */}
                  <motion.div variants={fadeInUp}>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base font-medium">Total Referrals</CardTitle>
                        <CardDescription>Your referral performance</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center">
                          <div className="w-12 h-12 rounded-full bg-sound-accent/10 flex items-center justify-center mr-3">
                            <Users className="w-6 h-6 text-sound-accent" />
                          </div>
                          <div>
                            <div className="text-3xl font-bold">{totalReferrals}</div>
                            <div className="text-xs text-muted-foreground flex items-center">
                              <span className="text-green-500 flex items-center mr-1">
                                <ChevronRight className="w-3 h-3 rotate-90" />
                                +8
                              </span> 
                              since last month
                            </div>
                          </div>
                        </div>
                        
                        {!isInfluencer && (
                          <div className="mt-4">
                            <div className="text-xs flex justify-between mb-1">
                              <span>Progress to Influencer status</span>
                              <span>{referralProgress.toFixed(0)}%</span>
                            </div>
                            <Progress value={referralProgress} className="h-1" />
                            <div className="mt-1 text-xs text-muted-foreground">
                              {influencerThreshold - totalReferrals} more referrals needed
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                  
                  {/* Referral Status */}
                  <motion.div variants={fadeInUp}>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base font-medium">Referral Status</CardTitle>
                        <CardDescription>Active and pending referrals</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <div className="text-center">
                            <div className="text-2xl font-bold">{activeReferrals}</div>
                            <div className="text-xs text-muted-foreground">Active</div>
                          </div>
                          
                          <div className="h-12 w-px bg-border"></div>
                          
                          <div className="text-center">
                            <div className="text-2xl font-bold">{pendingReferrals}</div>
                            <div className="text-xs text-muted-foreground">Pending</div>
                          </div>
                          
                          <div className="h-12 w-px bg-border"></div>
                          
                          <div className="text-center">
                            <div className="text-2xl font-bold flex items-center justify-center">
                              {earnedFromReferrals}
                              <span className="text-sm ml-1">ST</span>
                            </div>
                            <div className="text-xs text-muted-foreground">Earned</div>
                          </div>
                        </div>
                        
                        <div className="mt-4 p-3 rounded-md bg-green-500/5 border border-green-500/20 flex items-center">
                          <CheckCircle2 className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                          <p className="text-xs">
                            You earn {isInfluencer ? '20' : '10'} ST Coins for each successful referral
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                  
                  {/* Share Card */}
                  <motion.div variants={fadeInUp}>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base font-medium">Share Your Referral</CardTitle>
                        <CardDescription>Invite friends to join SoundTrump</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex">
                            <Input 
                              value={referralLink} 
                              readOnly 
                              className="rounded-r-none focus-visible:ring-0 border-r-0"
                            />
                            <Button 
                              variant="outline" 
                              size="icon" 
                              className="rounded-l-none border-l-0"
                              onClick={() => copyToClipboard(referralLink, 'link')}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                          
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button className="w-full">
                                <Share className="mr-2 h-4 w-4" />
                                Share with Friends
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Share Your Referral</DialogTitle>
                                <DialogDescription>
                                  Choose how you want to share your referral link
                                </DialogDescription>
                              </DialogHeader>
                              <div className="grid grid-cols-2 gap-3 mt-4">
                                {[
                                  { name: 'Copy Link', icon: <Link className="h-5 w-5" /> },
                                  { name: 'Twitter', icon: <Twitter className="h-5 w-5" /> },
                                  { name: 'Facebook', icon: <Facebook className="h-5 w-5" /> },
                                  { name: 'Email', icon: <Mail className="h-5 w-5" /> },
                                  { name: 'Message', icon: <MessageCircle className="h-5 w-5" /> }
                                ].map((item) => (
                                  <Button 
                                    key={item.name} 
                                    variant="outline" 
                                    className="justify-start"
                                    onClick={() => {
                                      if (item.name === 'Copy Link') {
                                        copyToClipboard(referralLink, 'link');
                                      } else {
                                        toast.success(`Share via ${item.name} would open here`);
                                      }
                                    }}
                                  >
                                    <div className="mr-2">{item.icon}</div>
                                    <span>{item.name}</span>
                                  </Button>
                                ))}
                              </div>
                              <div className="mt-4">
                                <h3 className="text-sm font-medium mb-2">Or share your code</h3>
                                <div className="flex">
                                  <Input 
                                    value={referralCode} 
                                    readOnly 
                                    className="font-mono"
                                  />
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="ml-2"
                                    onClick={() => copyToClipboard(referralCode, 'code')}
                                  >
                                    <Copy className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </motion.div>
                
                {/* Referral history */}
                <motion.div 
                  variants={fadeInUp}
                  initial="hidden"
                  animate="visible"
                  className="mb-8"
                >
                  <Tabs defaultValue="all" className="w-full">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-xl font-bold">Referral History</h2>
                      <TabsList>
                        <TabsTrigger value="all">All</TabsTrigger>
                        <TabsTrigger value="active">Active</TabsTrigger>
                        <TabsTrigger value="pending">Pending</TabsTrigger>
                      </TabsList>
                    </div>
                    
                    <TabsContent value="all" className="m-0">
                      <Card>
                        <CardContent className="p-0">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Reward</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {referrals.map((referral) => (
                                <TableRow key={referral.id}>
                                  <TableCell>
                                    <div className="font-medium">{referral.name}</div>
                                  </TableCell>
                                  <TableCell>
                                    {new Date(referral.date).toLocaleDateString()} 
                                  </TableCell>
                                  <TableCell>
                                    <Badge variant={referral.status === 'active' ? 'default' : 'outline'}>
                                      {referral.status === 'active' ? 'Active' : 'Pending'}
                                    </Badge>
                                  </TableCell>
                                  <TableCell className="text-right">
                                    {referral.reward} ST
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </CardContent>
                      </Card>
                    </TabsContent>
                    
                    <TabsContent value="active" className="m-0">
                      <Card>
                        <CardContent className="p-0">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Reward</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {referrals
                                .filter(referral => referral.status === 'active')
                                .map((referral) => (
                                  <TableRow key={referral.id}>
                                    <TableCell>
                                      <div className="font-medium">{referral.name}</div>
                                    </TableCell>
                                    <TableCell>
                                      {new Date(referral.date).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell>
                                      <Badge>Active</Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                      {referral.reward} ST
                                    </TableCell>
                                  </TableRow>
                                ))}
                            </TableBody>
                          </Table>
                        </CardContent>
                      </Card>
                    </TabsContent>
                    
                    <TabsContent value="pending" className="m-0">
                      <Card>
                        <CardContent className="p-0">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Potential Reward</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {referrals
                                .filter(referral => referral.status === 'pending')
                                .map((referral) => (
                                  <TableRow key={referral.id}>
                                    <TableCell>
                                      <div className="font-medium">{referral.name}</div>
                                    </TableCell>
                                    <TableCell>
                                      {new Date(referral.date).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell>
                                      <Badge variant="outline">Pending</Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                      {referral.reward} ST
                                    </TableCell>
                                  </TableRow>
                                ))}
                            </TableBody>
                          </Table>
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </Tabs>
                </motion.div>
                
                {/* Rules and FAQ */}
                <motion.div
                  variants={fadeInUp}
                  initial="hidden"
                  animate="visible"
                >
                  <Card>
                    <CardHeader>
                      <CardTitle>Referral Program Rules & FAQ</CardTitle>
                      <CardDescription>Important information about our referral program</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="p-3 rounded-md bg-amber-500/5 border border-amber-500/20 flex items-start">
                        <AlertTriangle className="w-4 h-4 text-amber-500 mr-2 flex-shrink-0 mt-0.5" />
                        <p className="text-sm">
                          Self-referrals and fraudulent activity are strictly prohibited and may result in account suspension.
                        </p>
                      </div>
                      
                      <div className="space-y-4">
                        {[
                          {
                            question: 'How do I earn referral rewards?',
                            answer: 'You earn referral rewards when someone signs up using your unique referral code or link and completes the registration process.'
                          },
                          {
                            question: 'When do referral rewards get credited?',
                            answer: 'Referral rewards are credited to your account once the referred user completes their first task on SoundTrump.'
                          },
                          {
                            question: 'What is Influencer status?',
                            answer: `Influencer status is achieved when you reach ${influencerThreshold} successful referrals. As an Influencer, you earn 2x the standard referral bonus (20 ST Coins instead of 10) for each new referral.`
                          },
                          {
                            question: 'Is there a limit to how many people I can refer?',
                            answer: 'There is no limit to the number of people you can refer. The more people you refer, the more rewards you can earn!'
                          }
                        ].map((item, index) => (
                          <div key={index}>
                            <h3 className="font-medium mb-1">{item.question}</h3>
                            <p className="text-sm text-muted-foreground">{item.answer}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </>
            )}
          </div>
        </main>
        
        <Footer />
      </div>
    </AnimatedTransition>
  );
};

export default Referrals;


import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import AnimatedTransition from '@/components/ui/AnimatedTransition';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useAuth } from '@/context/AuthContext';
import { Gift, Award, Star, Coins, Clock, ChevronRight, CheckCircle2, ArrowRight } from 'lucide-react';
import { toast } from '@/lib/toast';

// Mock rewards data
const availableRewards = [
  { 
    id: 'r1', 
    name: 'Concert Pre-sale Access', 
    description: 'Early access to concert ticket pre-sales for select artists',
    cost: 100,
    type: 'access',
    image: '/placeholder.svg'
  },
  { 
    id: 'r2', 
    name: 'Exclusive Stream', 
    description: 'Access to exclusive behind-the-scenes artist content',
    cost: 150,
    type: 'content',
    image: '/placeholder.svg'
  },
  { 
    id: 'r3', 
    name: '$5 Music Store Voucher', 
    description: 'Redeem for credit on selected digital music platforms',
    cost: 200,
    type: 'voucher',
    image: '/placeholder.svg'
  },
  { 
    id: 'r4', 
    name: 'Limited Edition Digital Badge', 
    description: 'Show off your music taste with this profile badge',
    cost: 50,
    type: 'badge',
    image: '/placeholder.svg'
  },
  { 
    id: 'r5', 
    name: 'Artist Merchandise Discount', 
    description: '15% off your next merch purchase at participating stores',
    cost: 250,
    type: 'discount',
    image: '/placeholder.svg'
  },
];

// Mock redeemed rewards
const redeemedRewards = [
  { 
    id: 'rr1', 
    name: 'Concert Pre-sale Access', 
    description: 'Early access to concert ticket pre-sales for select artists',
    redeemedDate: '2023-09-10T14:30:00',
    status: 'active',
    expiresOn: '2023-12-10T14:30:00',
    image: '/placeholder.svg'
  },
  { 
    id: 'rr2', 
    name: '$5 Music Store Voucher', 
    description: 'Redeem for credit on selected digital music platforms',
    redeemedDate: '2023-08-25T09:45:00',
    status: 'used',
    usedOn: '2023-09-02T16:20:00',
    image: '/placeholder.svg'
  }
];

const Rewards = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const [userCoins, setUserCoins] = useState(430);
  
  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  const handleRedeemReward = (reward: typeof availableRewards[0]) => {
    if (userCoins < reward.cost) {
      toast.error("You don't have enough coins to redeem this reward");
      return;
    }
    
    // Simulate redeeming reward
    setUserCoins(prev => prev - reward.cost);
    toast.success(`Successfully redeemed ${reward.name}`);
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
  
  return (
    <AnimatedTransition>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        
        <main className="flex-grow pt-24 pb-12">
          <div className="container px-4 mx-auto">
            {isLoading ? (
              // Loading skeleton
              <div className="animate-pulse">
                <div className="h-8 bg-muted w-1/3 mb-6 rounded"></div>
                <div className="h-32 bg-muted mb-8 rounded-lg"></div>
                <div className="h-6 bg-muted w-1/4 mb-4 rounded"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="h-64 bg-muted rounded-lg"></div>
                  ))}
                </div>
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
                  <h1 className="text-3xl font-bold mb-2">My Rewards</h1>
                  <p className="text-muted-foreground">
                    Redeem your earned coins for exclusive music rewards and benefits
                  </p>
                </motion.div>
                
                {/* Coin balance card */}
                <motion.div 
                  variants={fadeInUp} 
                  initial="hidden" 
                  animate="visible"
                  className="mb-8"
                >
                  <Card className="bg-gradient-to-r from-sound-dark to-sound-medium overflow-hidden">
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                        <div className="mb-4 md:mb-0">
                          <div className="flex items-center mb-2">
                            <Coins className="w-6 h-6 text-yellow-400 mr-2" />
                            <h2 className="text-xl font-semibold text-white">Sound Coins Balance</h2>
                          </div>
                          <div className="flex items-baseline">
                            <span className="text-3xl font-bold text-white">{userCoins}</span>
                            <span className="text-sm ml-2 text-white/80">coins available</span>
                          </div>
                          <p className="text-sm text-white/60 mt-1">
                            Complete tasks and refer friends to earn more coins
                          </p>
                        </div>
                        
                        <Button className="bg-white/20 hover:bg-white/30 text-white" size="sm">
                          <ArrowRight className="w-4 h-4 mr-1" />
                          Earn More Coins
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
                
                {/* Rewards section */}
                <div className="mb-8">
                  <Tabs defaultValue="available" className="w-full">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-xl font-bold">Rewards</h2>
                      <TabsList>
                        <TabsTrigger value="available">Available</TabsTrigger>
                        <TabsTrigger value="redeemed">My Rewards</TabsTrigger>
                      </TabsList>
                    </div>
                    
                    <TabsContent value="available" className="m-0">
                      <motion.div 
                        variants={staggerContainer} 
                        initial="hidden" 
                        animate="visible" 
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                      >
                        {availableRewards.map((reward) => (
                          <motion.div key={reward.id} variants={fadeInUp}>
                            <Card className="h-full flex flex-col overflow-hidden hover:shadow-md transition-shadow">
                              <div className="aspect-video bg-muted relative">
                                <img
                                  src={reward.image}
                                  alt={reward.name}
                                  className="w-full h-full object-cover"
                                />
                                
                                <Badge 
                                  className="absolute top-3 right-3 bg-sound-light"
                                  variant="default"
                                >
                                  {reward.cost} Coins
                                </Badge>
                              </div>
                              
                              <CardHeader className="pb-2">
                                <CardTitle className="text-lg">{reward.name}</CardTitle>
                                <CardDescription>{reward.description}</CardDescription>
                              </CardHeader>
                              
                              <CardFooter className="mt-auto pt-0">
                                <Button 
                                  className="w-full" 
                                  onClick={() => handleRedeemReward(reward)}
                                  disabled={userCoins < reward.cost}
                                >
                                  {userCoins >= reward.cost ? (
                                    <>
                                      <Gift className="w-4 h-4 mr-2" />
                                      Redeem Reward
                                    </>
                                  ) : (
                                    <>
                                      <Coins className="w-4 h-4 mr-2" />
                                      Need {reward.cost - userCoins} More Coins
                                    </>
                                  )}
                                </Button>
                              </CardFooter>
                            </Card>
                          </motion.div>
                        ))}
                      </motion.div>
                    </TabsContent>
                    
                    <TabsContent value="redeemed" className="m-0">
                      {redeemedRewards.length === 0 ? (
                        <div className="text-center py-12">
                          <Gift className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                          <h3 className="text-lg font-medium mb-2">No rewards redeemed yet</h3>
                          <p className="text-muted-foreground mb-4">
                            Redeem your coins for exclusive rewards and they will appear here
                          </p>
                          <Button variant="outline" className="mx-auto">
                            Browse Available Rewards
                          </Button>
                        </div>
                      ) : (
                        <motion.div 
                          variants={staggerContainer} 
                          initial="hidden" 
                          animate="visible" 
                          className="grid grid-cols-1 md:grid-cols-2 gap-6"
                        >
                          {redeemedRewards.map((reward) => (
                            <motion.div key={reward.id} variants={fadeInUp}>
                              <Card className="overflow-hidden">
                                <div className="flex flex-col md:flex-row">
                                  <div className="md:w-1/3 aspect-square md:aspect-auto bg-muted">
                                    <img
                                      src={reward.image}
                                      alt={reward.name}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                  
                                  <div className="md:w-2/3 p-4">
                                    <div className="flex justify-between items-start">
                                      <div>
                                        <h3 className="font-medium">{reward.name}</h3>
                                        <p className="text-sm text-muted-foreground">
                                          {reward.description}
                                        </p>
                                      </div>
                                      
                                      <Badge variant={reward.status === 'active' ? 'default' : 'outline'}>
                                        {reward.status === 'active' ? 'Active' : 'Used'}
                                      </Badge>
                                    </div>
                                    
                                    <div className="mt-4 text-xs text-muted-foreground">
                                      <div className="flex items-center mb-1">
                                        <CheckCircle2 className="w-3 h-3 mr-1" />
                                        <span>Redeemed on {new Date(reward.redeemedDate).toLocaleDateString()}</span>
                                      </div>
                                      
                                      {reward.status === 'active' ? (
                                        <div className="flex items-center">
                                          <Clock className="w-3 h-3 mr-1" />
                                          <span>Expires on {new Date(reward.expiresOn).toLocaleDateString()}</span>
                                        </div>
                                      ) : (
                                        <div className="flex items-center">
                                          <CheckCircle2 className="w-3 h-3 mr-1" />
                                          <span>Used on {new Date(reward.usedOn).toLocaleDateString()}</span>
                                        </div>
                                      )}
                                    </div>
                                    
                                    <Button 
                                      className="mt-4" 
                                      variant={reward.status === 'active' ? 'default' : 'outline'}
                                      disabled={reward.status !== 'active'}
                                    >
                                      {reward.status === 'active' ? 'Use Reward' : 'View Details'}
                                    </Button>
                                  </div>
                                </div>
                              </Card>
                            </motion.div>
                          ))}
                        </motion.div>
                      )}
                    </TabsContent>
                  </Tabs>
                </div>
              </>
            )}
          </div>
        </main>
        
        <Footer />
      </div>
    </AnimatedTransition>
  );
};

export default Rewards;

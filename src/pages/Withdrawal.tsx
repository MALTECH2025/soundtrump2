
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AnimatedTransition } from '@/components/ui/AnimatedTransition';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useAuth } from '@/context/AuthContext';
import { Coins, AlertCircle, Clock } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const Withdrawal = () => {
  const { isAuthenticated, profile } = useAuth();

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  };

  if (!isAuthenticated) {
    return (
      <AnimatedTransition>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-grow pt-24 pb-12 flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-2xl font-bold mb-4">Please log in to view withdrawal options</h1>
              <p className="text-muted-foreground">Sign in to your account to access coin withdrawal.</p>
            </div>
          </main>
          <Footer />
        </div>
      </AnimatedTransition>
    );
  }
  
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
              <h1 className="text-3xl font-bold mb-2">Coin Withdrawal</h1>
              <p className="text-muted-foreground">
                Convert your earned ST coins to real value
              </p>
            </motion.div>
            
            {/* ST balance card */}
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
                        <h2 className="text-xl font-semibold text-white">Available Balance</h2>
                      </div>
                      <div className="flex items-baseline">
                        <span className="text-3xl font-bold text-white">{profile?.points || 0}</span>
                        <span className="text-sm ml-2 text-white/80">ST Coins</span>
                      </div>
                      <p className="text-sm text-white/60 mt-1">
                        Coins earned through tasks and referrals
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            
            {/* Withdrawal not available notice */}
            <motion.div 
              variants={fadeInUp} 
              initial="hidden" 
              animate="visible"
              className="mb-8"
            >
              <Alert className="border-amber-200 bg-amber-50">
                <AlertCircle className="h-4 w-4 text-amber-600" />
                <AlertDescription className="text-amber-800">
                  <strong>Withdrawal Currently Unavailable</strong>
                  <br />
                  Coin withdrawal functionality is temporarily disabled while we implement enhanced security measures and payment processing systems. We appreciate your patience as we work to provide you with the best withdrawal experience.
                </AlertDescription>
              </Alert>
            </motion.div>

            {/* Coming soon features */}
            <motion.div 
              variants={fadeInUp} 
              initial="hidden" 
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              <Card className="opacity-50">
                <CardHeader>
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 mr-2 text-muted-foreground" />
                    <CardTitle className="text-lg">Bank Transfer</CardTitle>
                  </div>
                  <CardDescription>Direct transfer to your bank account</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Minimum withdrawal: 1,000 ST<br />
                    Processing time: 2-3 business days<br />
                    <span className="text-amber-600">Coming Soon</span>
                  </p>
                </CardContent>
              </Card>

              <Card className="opacity-50">
                <CardHeader>
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 mr-2 text-muted-foreground" />
                    <CardTitle className="text-lg">PayPal</CardTitle>
                  </div>
                  <CardDescription>Instant withdrawal to PayPal</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Minimum withdrawal: 500 ST<br />
                    Processing time: Instant<br />
                    <span className="text-amber-600">Coming Soon</span>
                  </p>
                </CardContent>
              </Card>

              <Card className="opacity-50">
                <CardHeader>
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 mr-2 text-muted-foreground" />
                    <CardTitle className="text-lg">Cryptocurrency</CardTitle>
                  </div>
                  <CardDescription>Withdraw to crypto wallet</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Minimum withdrawal: 250 ST<br />
                    Processing time: 10-30 minutes<br />
                    <span className="text-amber-600">Coming Soon</span>
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Additional info */}
            <motion.div 
              variants={fadeInUp} 
              initial="hidden" 
              animate="visible"
              className="mt-8"
            >
              <Card>
                <CardHeader>
                  <CardTitle>How Withdrawal Will Work</CardTitle>
                  <CardDescription>When withdrawal becomes available</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Exchange Rate</h4>
                    <p className="text-sm text-muted-foreground">
                      ST coins will be exchanged at current market rates, which may vary based on platform performance and market conditions.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Verification Required</h4>
                    <p className="text-sm text-muted-foreground">
                      Identity verification will be required for withdrawals to comply with financial regulations and ensure account security.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Stay Updated</h4>
                    <p className="text-sm text-muted-foreground">
                      We'll notify all users via email and in-app notifications when withdrawal functionality becomes available.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </main>
        
        <Footer />
      </div>
    </AnimatedTransition>
  );
};

export default Withdrawal;

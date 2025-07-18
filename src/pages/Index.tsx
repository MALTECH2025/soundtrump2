
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Users, Trophy, Coins, Music, Star, Gift, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { AnimatedTransition } from '@/components/ui/AnimatedTransition';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { checkAndApplyReferralFromUrl } from '@/lib/api/referrals';
import { toast } from '@/lib/toast';

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    // Check for referral code in URL and show notification
    const urlParams = new URLSearchParams(window.location.search);
    const referralCode = urlParams.get('ref');
    
    if (referralCode) {
      if (isAuthenticated) {
        // If already logged in, apply immediately
        checkAndApplyReferralFromUrl().then((result) => {
          if (result?.success) {
            toast.success(result.message);
          } else if (result?.message) {
            toast.error(result.message);
          }
        });
      } else {
        // Show message to sign up
        toast.success('Referral code detected! Sign up to earn bonus rewards!');
      }
    }
  }, [isAuthenticated]);

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };

  return (
    <AnimatedTransition>
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-sound-dark via-sound-dark to-purple-900/20">
        <Navbar />
        
        {/* Hero Section */}
        <section className="flex-grow pt-24 pb-12 px-4">
          <div className="container mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-8"
            >
              <Badge variant="secondary" className="mb-4 bg-gradient-to-r from-purple-500 to-yellow-500 text-white border-0">
                <Star className="w-4 h-4 mr-2" />
                Earn Crypto Rewards
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-purple-200 to-yellow-300 bg-clip-text text-transparent">
                Turn Your Music 
                <br />
                Into <span className="text-yellow-400">Money</span>
              </h1>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Complete simple music tasks, refer friends, and earn ST Coins. 
                Your gateway to the future of music rewards.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  onClick={handleGetStarted}
                  className="bg-gradient-to-r from-purple-500 to-yellow-500 hover:from-purple-600 hover:to-yellow-600 text-white font-semibold px-8 py-3 rounded-full"
                >
                  {isAuthenticated ? 'Go to Dashboard' : 'Start Earning Now'}
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={() => navigate('/how-it-works')}
                  className="border-purple-500 text-purple-300 hover:bg-purple-500/10 px-8 py-3 rounded-full"
                >
                  Learn More
                </Button>
              </div>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16"
            >
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-400 mb-2">10,000+</div>
                <div className="text-gray-400">Active Users</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400 mb-2">$50K+</div>
                <div className="text-gray-400">Rewards Paid</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-400 mb-2">500+</div>
                <div className="text-gray-400">Daily Tasks</div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-4 bg-black/20">
          <div className="container mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
                How You <span className="text-yellow-400">Earn</span>
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Multiple ways to earn ST Coins and build your crypto portfolio
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <Card className="bg-gradient-to-br from-purple-900/50 to-black/50 border-purple-500/20 hover:border-purple-400/40 transition-all duration-300">
                  <CardHeader>
                    <Music className="w-8 h-8 text-purple-400 mb-2" />
                    <CardTitle className="text-white">Music Tasks</CardTitle>
                    <CardDescription className="text-gray-400">
                      Complete simple music-related tasks and earn ST Coins
                    </CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Card className="bg-gradient-to-br from-yellow-900/50 to-black/50 border-yellow-500/20 hover:border-yellow-400/40 transition-all duration-300">
                  <CardHeader>
                    <Users className="w-8 h-8 text-yellow-400 mb-2" />
                    <CardTitle className="text-white">Referral Program</CardTitle>
                    <CardDescription className="text-gray-400">
                      Invite friends and earn 10 ST Coins for each referral
                    </CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <Card className="bg-gradient-to-br from-purple-900/50 to-black/50 border-purple-500/20 hover:border-purple-400/40 transition-all duration-300">
                  <CardHeader>
                    <Trophy className="w-8 h-8 text-purple-400 mb-2" />
                    <CardTitle className="text-white">Leaderboard</CardTitle>
                    <CardDescription className="text-gray-400">
                      Compete with others and earn bonus rewards
                    </CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <Card className="bg-gradient-to-br from-yellow-900/50 to-black/50 border-yellow-500/20 hover:border-yellow-400/40 transition-all duration-300">
                  <CardHeader>
                    <Gift className="w-8 h-8 text-yellow-400 mb-2" />
                    <CardTitle className="text-white">Redeem Rewards</CardTitle>
                    <CardDescription className="text-gray-400">
                      Exchange your ST Coins for real crypto and prizes
                    </CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-gradient-to-r from-purple-900/50 to-yellow-900/50 rounded-2xl p-8 border border-purple-500/20"
            >
              <Zap className="w-16 h-16 text-yellow-400 mx-auto mb-6" />
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
                Ready to Start <span className="text-yellow-400">Earning?</span>
              </h2>
              <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
                Join thousands of users who are already earning crypto rewards through music. 
                It's free to start and takes less than 2 minutes to sign up.
              </p>
              <Button 
                size="lg" 
                onClick={handleGetStarted}
                className="bg-gradient-to-r from-purple-500 to-yellow-500 hover:from-purple-600 hover:to-yellow-600 text-white font-semibold px-8 py-3 rounded-full"
              >
                {isAuthenticated ? 'Go to Dashboard' : 'Join SoundTrump Now'}
                <Coins className="ml-2 w-5 h-5" />
              </Button>
            </motion.div>
          </div>
        </section>

        <Footer />
      </div>
    </AnimatedTransition>
  );
};

export default Index;

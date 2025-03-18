
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Music2, ArrowRight, CheckCircle, Zap, Users, Trophy, Clock } from 'lucide-react';
import AnimatedTransition from '@/components/ui/AnimatedTransition';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import AuthModal from '@/components/auth/AuthModal';

const Index = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authType, setAuthType] = useState<'login' | 'register'>('register');
  
  const openAuthModal = (type: 'login' | 'register') => {
    setAuthType(type);
    setIsAuthModalOpen(true);
  };

  // Staggered animation for children
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  return (
    <AnimatedTransition>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        
        {/* Hero Section */}
        <section className="pt-24 pb-12 md:pt-32 md:pb-20">
          <div className="container px-4 mx-auto">
            <div className="max-w-3xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <span className="inline-block px-3 py-1 mb-4 text-xs font-medium rounded-full bg-sound-light/10 text-sound-light">
                  Your Music, Your Rewards
                </span>
              </motion.div>
              
              <motion.h1 
                className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-sound-medium to-sound-light"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                Get Rewarded for Streaming Your Favorite Music
              </motion.h1>
              
              <motion.p 
                className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                Complete simple tasks, earn ST Coins, and climb the ranks while enjoying your music streaming platforms.
              </motion.p>
              
              <motion.div 
                className="flex flex-col sm:flex-row gap-4 justify-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Button 
                  size="lg" 
                  onClick={() => openAuthModal('register')}
                  className="bg-gradient-to-r from-sound-light to-sound-accent hover:opacity-90 transition-opacity"
                >
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={() => openAuthModal('login')}
                >
                  I Already Have an Account
                </Button>
              </motion.div>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-12 md:py-24 bg-muted/30">
          <div className="container px-4 mx-auto">
            <motion.div 
              className="text-center mb-12 md:mb-20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">How SoundTrump Works</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Earn ST Coins by completing tasks and engaging with your favorite music platforms. Redeem your earnings and climb the leaderboard.
              </p>
            </motion.div>
            
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {[
                {
                  icon: <Music2 className="h-10 w-10 text-sound-light" />,
                  title: 'Stream and Earn',
                  description: 'Connect your Spotify account and earn ST Coins by streaming music and completing curated playlists.'
                },
                {
                  icon: <Zap className="h-10 w-10 text-sound-light" />,
                  title: 'Complete Tasks',
                  description: 'Engage with the platform by completing simple tasks and boost your earnings.'
                },
                {
                  icon: <Trophy className="h-10 w-10 text-sound-light" />,
                  title: 'Climb the Ranks',
                  description: 'Progress through 10 crystal ranks and compete with others on the global leaderboard.'
                }
              ].map((feature, index) => (
                <motion.div 
                  key={index}
                  variants={itemVariants}
                  className="bg-card p-6 rounded-xl border border-border hover:shadow-md transition-shadow"
                >
                  <div className="mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
        
        {/* Call to Action */}
        <section className="py-16 md:py-24">
          <div className="container px-4 mx-auto">
            <motion.div 
              className="max-w-3xl mx-auto text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Get Started?</h2>
              <p className="text-muted-foreground mb-8">
                Join thousands of music lovers who are already earning rewards while enjoying their favorite tunes.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  onClick={() => openAuthModal('register')}
                  className="bg-gradient-to-r from-sound-light to-sound-accent hover:opacity-90 transition-opacity"
                >
                  Sign Up Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={() => openAuthModal('login')}
                >
                  Login
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
        
        <Footer />
        
        {/* Auth Modal */}
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          defaultTab={authType}
        />
      </div>
    </AnimatedTransition>
  );
};

export default Index;

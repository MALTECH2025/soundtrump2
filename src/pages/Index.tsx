import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle, Zap, Users, Trophy, Clock } from 'lucide-react';
import { AnimatedTransition } from '@/components/ui/AnimatedTransition';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useAuth } from '@/context/AuthContext';

const Index = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const features = [
    {
      icon: <Zap className="h-8 w-8 text-accent" />,
      title: 'Instant Rewards',
      description: 'Earn ST Coins instantly for every completed task. No waiting, no delays.',
    },
    {
      icon: <Users className="h-8 w-8 text-primary" />,
      title: 'Community Driven',
      description: 'Join thousands of users earning together. Refer friends and earn bonus rewards.',
    },
    {
      icon: <Trophy className="h-8 w-8 text-accent" />,
      title: 'Leaderboards',
      description: 'Compete with others and climb the ranks. Top performers get exclusive rewards.',
    },
    {
      icon: <Clock className="h-8 w-8 text-primary" />,
      title: '24/7 Mining',
      description: 'Passive income through our mining system. Earn ST Coins even while you sleep.',
    },
  ];

  const steps = [
    {
      number: '01',
      title: 'Sign Up',
      description: 'Create your free account in seconds and get instant access to earning opportunities.',
    },
    {
      number: '02', 
      title: 'Complete Tasks',
      description: 'Choose from music streaming, social engagement, and daily challenges.',
    },
    {
      number: '03',
      title: 'Earn Rewards',
      description: 'Get ST Coins instantly and redeem them for real rewards and crypto.',
    },
  ];

  const stats = [
    { label: 'Active Users', value: '50K+' },
    { label: 'Tasks Completed', value: '2M+' },
    { label: 'ST Coins Earned', value: '10M+' },
    { label: 'Rewards Claimed', value: '25K+' },
  ];

  return (
    <AnimatedTransition>
      <div className="min-h-screen bg-gradient-crypto">
        <Navbar />
        
        {/* Hero Section */}
        <section className="relative pt-20 pb-16 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10 opacity-50" />
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="mb-8"
              >
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                  <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent crypto-pulse">
                    Earn Crypto
                  </span>
                  <br />
                  <span className="text-foreground">By Completing</span>
                  <br />
                  <span className="bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
                    Simple Tasks
                  </span>
                </h1>
                <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
                  Join the decentralized economy. Stream music, engage socially, and complete daily challenges to earn ST Coins.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
              >
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-primary to-accent hover:from-primary/80 hover:to-accent/80 text-white font-semibold px-8 py-4 rounded-full crypto-glow"
                  onClick={() => navigate(isAuthenticated ? '/dashboard' : '/login')}
                >
                  {isAuthenticated ? 'Go to Dashboard' : 'Start Earning Now'}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-primary/30 text-primary hover:bg-primary/10 px-8 py-4 rounded-full"
                  onClick={() => navigate('/how-it-works')}
                >
                  Learn How It Works
                </Button>
              </motion.div>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto"
              >
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-2xl md:text-3xl font-bold text-primary crypto-glow">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                How SoundTrump Works
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Three simple steps to start earning cryptocurrency today
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {[
                {
                  icon: <img src="/lovable-uploads/d171e28f-9cf9-4701-a3d8-bd8c580e00d9.png" alt="SoundTrump" className="h-10 w-10 crypto-float" />,
                  title: 'Stream and Earn',
                  description: 'Connect your Spotify account and earn ST Coins by streaming music and completing curated playlists.'
                },
                {
                  icon: <Users className="h-10 w-10 text-primary crypto-float" />,
                  title: 'Social Tasks',
                  description: 'Engage with social media content, follow accounts, and share posts to earn additional ST Coins.'
                },
                {
                  icon: <Trophy className="h-10 w-10 text-accent crypto-float" />,
                  title: 'Claim Rewards',
                  description: 'Redeem your ST Coins for cryptocurrency, gift cards, exclusive merchandise, and more rewards.'
                }
              ].map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center group"
                >
                  <div className="glass p-8 rounded-2xl crypto-glow-accent hover:scale-105 transition-all duration-300">
                    <div className="mb-6 flex justify-center">
                      {step.icon}
                    </div>
                    <h3 className="text-xl font-semibold mb-4 text-foreground">{step.title}</h3>
                    <p className="text-muted-foreground">{step.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Why Choose SoundTrump?
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                The most rewarding platform for crypto enthusiasts and music lovers
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="glass p-6 rounded-xl hover:scale-105 transition-all duration-300 crypto-glow"
                >
                  <div className="mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold mb-2 text-foreground">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="glass p-12 rounded-2xl text-center max-w-4xl mx-auto crypto-glow"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Ready to Start Earning?
              </h2>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Join thousands of users who are already earning cryptocurrency through SoundTrump's innovative task-based rewards system.
              </p>
              <Button 
                size="lg"
                className="bg-gradient-to-r from-primary to-accent hover:from-primary/80 hover:to-accent/80 text-white font-semibold px-8 py-4 rounded-full crypto-glow"
                onClick={() => navigate(isAuthenticated ? '/dashboard' : '/login')}
              >
                {isAuthenticated ? 'Go to Dashboard' : 'Get Started Today'}
                <ArrowRight className="ml-2 h-5 w-5" />
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

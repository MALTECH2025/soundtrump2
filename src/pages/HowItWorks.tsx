
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { 
  Music, 
  Coins, 
  Users, 
  Trophy, 
  ArrowRight, 
  CheckCircle, 
  Play,
  Headphones,
  Smartphone,
  Gift,
  TrendingUp,
  Shield
} from 'lucide-react';
import LegalPageLayout from '@/components/layout/LegalPageLayout';

const HowItWorks = () => {
  const steps = [
    {
      icon: <Smartphone className="w-8 h-8 text-sound-light" />,
      title: "Sign Up & Connect",
      description: "Create your free SoundTrump account and connect your favorite music streaming platforms like Spotify, Apple Music, or YouTube Music.",
      details: [
        "Quick registration process",
        "Secure platform integration",
        "Privacy-first approach"
      ]
    },
    {
      icon: <Headphones className="w-8 h-8 text-sound-light" />,
      title: "Listen to Music",
      description: "Continue enjoying your favorite songs, playlists, and podcasts as you normally would. No changes to your listening habits required.",
      details: [
        "Listen naturally",
        "All genres supported",
        "Passive earning system"
      ]
    },
    {
      icon: <Coins className="w-8 h-8 text-sound-accent" />,
      title: "Earn ST Coins",
      description: "Automatically earn ST coins for every minute of music you stream. Complete additional tasks and challenges for bonus rewards.",
      details: [
        "Automatic coin generation",
        "Bonus task rewards",
        "Daily challenges available"
      ]
    },
    {
      icon: <Gift className="w-8 h-8 text-sound-light" />,
      title: "Redeem & Withdraw",
      description: "Use your earned ST coins to access exclusive content, concert tickets, merchandise, or convert them to real value.",
      details: [
        "Exclusive music content",
        "Concert pre-sale access",
        "Future withdrawal options"
      ]
    }
  ];

  const earningMethods = [
    {
      icon: <Play className="w-6 h-6 text-sound-light" />,
      title: "Streaming Rewards",
      description: "Earn 1-5 ST coins per minute of active listening",
      multiplier: "Base Rate"
    },
    {
      icon: <Trophy className="w-6 h-6 text-sound-accent" />,
      title: "Daily Tasks",
      description: "Complete daily challenges for bonus rewards",
      multiplier: "50-500 ST"
    },
    {
      icon: <Users className="w-6 h-6 text-sound-light" />,
      title: "Referral Program",
      description: "Invite friends and earn 10% of their lifetime earnings",
      multiplier: "10% Commission"
    },
    {
      icon: <TrendingUp className="w-6 h-6 text-sound-accent" />,
      title: "Tier Bonuses",
      description: "Higher tiers unlock increased earning multipliers",
      multiplier: "Up to 3x"
    }
  ];

  const features = [
    {
      icon: <Shield className="w-6 h-6 text-sound-light" />,
      title: "Privacy Protected",
      description: "Your listening data remains private and secure. We only track what's necessary for rewards."
    },
    {
      icon: <Music className="w-6 h-6 text-sound-accent" />,
      title: "Platform Agnostic",
      description: "Works with all major streaming platforms. Switch between services without losing progress."
    },
    {
      icon: <Coins className="w-6 h-6 text-sound-light" />,
      title: "Fair Distribution",
      description: "Our algorithm ensures fair coin distribution based on genuine listening activity."
    }
  ];

  return (
    <LegalPageLayout 
      title="How SoundTrump Works"
      description="Discover how you can earn ST coins while enjoying your favorite music across all streaming platforms"
      icon={<Music className="h-6 w-6 text-sound-light" />}
    >
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center mb-6">
            <img 
              src="/lovable-uploads/d171e28f-9cf9-4701-a3d8-bd8c580e00d9.png" 
              alt="SoundTrump" 
              className="w-16 h-16"
            />
          </div>
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-sound-light to-sound-accent">
            How SoundTrump Works
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover how you can earn ST coins while enjoying your favorite music across all streaming platforms
          </p>
        </div>

        {/* How It Works Steps */}
        <section className="space-y-8">
          <h2 className="text-3xl font-bold text-center mb-8">Getting Started in 4 Simple Steps</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, index) => (
              <Card key={index} className="relative">
                <CardHeader className="text-center pb-4">
                  <div className="flex justify-center mb-4">
                    <div className="p-3 bg-sound-light/10 rounded-full">
                      {step.icon}
                    </div>
                  </div>
                  <Badge variant="outline" className="mb-2">Step {index + 1}</Badge>
                  <CardTitle className="text-lg">{step.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center mb-4">
                    {step.description}
                  </CardDescription>
                  <ul className="space-y-2">
                    {step.details.map((detail, detailIndex) => (
                      <li key={detailIndex} className="flex items-center text-sm text-muted-foreground">
                        <CheckCircle className="w-4 h-4 mr-2 text-sound-accent" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </CardContent>
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute -right-3 top-1/2 transform -translate-y-1/2">
                    <ArrowRight className="w-6 h-6 text-sound-light" />
                  </div>
                )}
              </Card>
            ))}
          </div>
        </section>

        {/* Earning Methods */}
        <section className="space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Multiple Ways to Earn ST Coins</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              SoundTrump offers various earning opportunities to maximize your rewards while enjoying music
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {earningMethods.map((method, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-sound-light/10 rounded-lg">
                      {method.icon}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{method.title}</CardTitle>
                      <Badge variant="secondary">{method.multiplier}</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription>{method.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Key Features */}
        <section className="space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Why Choose SoundTrump?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Built with user privacy and fair rewards in mind
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="text-center">
                <CardHeader>
                  <div className="flex justify-center mb-4">
                    <div className="p-3 bg-sound-light/10 rounded-full">
                      {feature.icon}
                    </div>
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        <section className="space-y-8">
          <h2 className="text-3xl font-bold text-center">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">How much can I earn?</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Earnings vary based on listening time, tier level, and completed tasks. Active users typically earn 100-1000 ST coins daily.
                </CardDescription>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Is my data safe?</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Yes! We only access minimal listening metadata required for rewards. Your personal data and playlists remain private.
                </CardDescription>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Which platforms are supported?</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Currently supporting Spotify, with Apple Music, YouTube Music, and other major platforms coming soon.
                </CardDescription>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">When can I withdraw coins?</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Withdrawal features are currently in development. For now, use coins for exclusive content and rewards in our platform.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center space-y-6 py-12 bg-gradient-to-r from-sound-light/5 to-sound-accent/5 rounded-lg">
          <h2 className="text-3xl font-bold">Ready to Start Earning?</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Join thousands of music lovers who are already earning ST coins while enjoying their favorite tracks
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-gradient-to-r from-sound-light to-sound-medium">
              <Link to="/login">
                Get Started Now
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link to="/contact">Contact Support</Link>
            </Button>
          </div>
        </section>
      </div>
    </LegalPageLayout>
  );
};

export default HowItWorks;


import { ShieldCheck, CheckCircle, Headphones, TrendingUp, Users, Award } from 'lucide-react';
import { motion } from 'framer-motion';
import LegalPageLayout from '@/components/layout/LegalPageLayout';
import { Card, CardContent } from '@/components/ui/card';

const DspTrust = () => {
  const benefits = [
    {
      title: 'Authentic Engagement',
      description: 'We drive real, meaningful interactions with music—not artificial streams or bot activity.',
      icon: <CheckCircle className="h-10 w-10 text-sound-light" />
    },
    {
      title: 'Premium Conversions',
      description: 'Our platform encourages free users to experience the benefits of premium subscriptions.',
      icon: <Award className="h-10 w-10 text-sound-light" />
    },
    {
      title: 'Extended Listening Sessions',
      description: 'Users engage in longer, more focused streaming sessions through our task system.',
      icon: <Headphones className="h-10 w-10 text-sound-light" />
    },
    {
      title: 'Artist Discovery',
      description: 'We promote exploration of new artists and genres, expanding listener horizons.',
      icon: <TrendingUp className="h-10 w-10 text-sound-light" />
    },
    {
      title: 'Community Growth',
      description: 'Our referral system brings new users to streaming platforms through trusted recommendations.',
      icon: <Users className="h-10 w-10 text-sound-light" />
    }
  ];

  return (
    <LegalPageLayout 
      title="DSP Trust & Support" 
      description="How SoundTrump benefits digital streaming platforms and fosters ethical engagement."
      icon={<ShieldCheck className="h-6 w-6 text-sound-light" />}
    >
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">Our Commitment to Digital Streaming Platforms</h2>
        <p className="text-lg">
          SoundTrump is designed to support the digital music ecosystem by driving organic engagement with streaming platforms like Spotify and Apple Music. Our mission is to create value for all participants—users, platforms, and artists—through ethical interactions and genuine music discovery.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">How SoundTrump Benefits DSPs</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="mb-4">
                      {benefit.icon}
                    </div>
                    <h3 className="text-xl font-bold mb-2">{benefit.title}</h3>
                    <p className="text-muted-foreground">{benefit.description}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>
      
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">Premium Subscription Growth</h2>
        <p className="mb-4">
          SoundTrump strategically incentivizes free users to explore the benefits of premium subscriptions through:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Tasks that highlight premium-only features</li>
          <li>Enhanced rewards for premium subscribers</li>
          <li>Educational content about the benefits of premium subscriptions</li>
          <li>Referral bonuses for converting friends to premium subscribers</li>
        </ul>
      </section>
      
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">Ethical Artist Promotion</h2>
        <p className="mb-4">
          We believe in supporting artists of all sizes. Our platform:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Encourages discovery of emerging artists</li>
          <li>Promotes diverse music genres and cultural expressions</li>
          <li>Creates tasks that expose users to new music they might not otherwise discover</li>
          <li>Avoids artificial streaming that could harm artist compensation systems</li>
        </ul>
      </section>
      
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">Anti-Fraud Measures</h2>
        <p className="mb-4">
          SoundTrump takes the integrity of streaming platforms seriously. We implement robust anti-fraud measures to ensure all engagement is genuine:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>AI-powered detection of suspicious activity</li>
          <li>IP address tracking to prevent multiple account abuse</li>
          <li>Verification systems for task completion</li>
          <li>Human review of flagged accounts</li>
          <li>Regular audits of platform activity</li>
        </ul>
      </section>
      
      <section>
        <h2 className="text-2xl font-bold mb-4">Partnership Opportunities</h2>
        <p className="mb-4">
          SoundTrump welcomes partnerships with digital streaming platforms to enhance our mutual goals. We offer:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Co-branded marketing campaigns</li>
          <li>Custom integration solutions</li>
          <li>Data sharing opportunities (with appropriate privacy measures)</li>
          <li>Collaborative feature development</li>
        </ul>
        <p className="mt-6">
          For partnership inquiries, please contact us at partnerships@soundtrump.com.
        </p>
      </section>
    </LegalPageLayout>
  );
};

export default DspTrust;

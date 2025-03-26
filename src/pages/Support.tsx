import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { PanelRightOpen, Search, HelpCircle, MessagesSquare, Headphones, ChevronRight, ExternalLink } from 'lucide-react';
import { toast } from '@/lib/toast';
import { AnimatedTransition } from '@/components/ui/AnimatedTransition';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const faqs = [
  {
    id: '1',
    question: 'What is SoundTrump?',
    answer: 'SoundTrump is a platform that rewards you for listening to music. Connect your streaming accounts, complete tasks, and earn points!'
  },
  {
    id: '2',
    question: 'How do I earn points?',
    answer: 'You can earn points by connecting your music streaming accounts, completing daily and weekly tasks, referring friends, and participating in special events.'
  },
  {
    id: '3',
    question: 'What can I do with my points?',
    answer: 'Points can be redeemed for various rewards, such as gift cards, merchandise, exclusive content, and more. Check the Rewards section for available options.'
  },
  {
    id: '4',
    question: 'Is SoundTrump free to use?',
    answer: 'Yes, SoundTrump is free to use. However, some features and rewards may require a premium subscription.'
  },
  {
    id: '5',
    question: 'How do I connect my music streaming accounts?',
    answer: 'Go to the Settings page and click on the "Connect Accounts" tab. Follow the instructions to connect your Spotify, Apple Music, or other supported accounts.'
  },
  {
    id: '6',
    question: 'What if I have a problem or question that is not answered here?',
    answer: 'Please contact our support team by submitting a request through the "Contact Us" form. We are always happy to help!'
  }
];

const Support = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <AnimatedTransition>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        
        <main className="flex-grow pt-24 pb-12">
          <div className="container px-4 mx-auto max-w-5xl">
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              className="mb-8 text-center"
            >
              <h1 className="text-3xl md:text-4xl font-bold mb-4">Support Center</h1>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Welcome to the SoundTrump Support Center. Find answers to common questions, troubleshoot issues, and learn more about our platform.
              </p>
            </motion.div>
            
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              className="mb-8"
            >
              <Card>
                <CardHeader>
                  <CardTitle>How can we help you?</CardTitle>
                  <CardDescription>Search our knowledge base or browse by topic</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="relative">
                    <Input 
                      type="search" 
                      placeholder="Search for articles..." 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
            >
              <Tabs defaultValue="faqs" className="w-full">
                <TabsList className="mb-4">
                  <TabsTrigger value="faqs">
                    <HelpCircle className="w-4 h-4 mr-2" />
                    FAQs
                  </TabsTrigger>
                  <TabsTrigger value="contact">
                    <MessagesSquare className="w-4 h-4 mr-2" />
                    Contact Us
                  </TabsTrigger>
                  <TabsTrigger value="guides">
                    <Headphones className="w-4 h-4 mr-2" />
                    Guides
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="faqs" className="m-0">
                  <Card>
                    <CardHeader>
                      <CardTitle>Frequently Asked Questions</CardTitle>
                      <CardDescription>Find quick answers to common questions</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {faqs.map((faq) => (
                        <div key={faq.id} className="space-y-2">
                          <h3 className="text-lg font-medium">{faq.question}</h3>
                          <p className="text-muted-foreground">{faq.answer}</p>
                        </div>
                      ))}
                      <Button variant="link" className="justify-start">
                        View All FAQs
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="contact" className="m-0">
                  <Card>
                    <CardHeader>
                      <CardTitle>Contact Our Support Team</CardTitle>
                      <CardDescription>Need more help? Reach out to us directly</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Textarea placeholder="Describe your issue..." className="mb-4" />
                      <Button>Submit Request</Button>
                    </CardContent>
                    <CardFooter>
                      <p className="text-muted-foreground text-sm">
                        We typically respond within 24-48 hours.
                      </p>
                    </CardFooter>
                  </Card>
                </TabsContent>
                
                <TabsContent value="guides" className="m-0">
                  <Card>
                    <CardHeader>
                      <CardTitle>Guides and Tutorials</CardTitle>
                      <CardDescription>Learn how to use SoundTrump with our step-by-step guides</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {[
                        { title: 'Connecting Your Spotify Account', description: 'A step-by-step guide to connecting your Spotify account to SoundTrump.', link: '#' },
                        { title: 'Earning Rewards', description: 'Learn how to earn rewards by completing tasks and participating in challenges.', link: '#' },
                        { title: 'Redeeming Your Points', description: 'A guide to redeeming your points for gift cards, merchandise, and more.', link: '#' }
                      ].map((guide, index) => (
                        <div key={index} className="flex items-center justify-between p-3 rounded-md hover:bg-muted/50 transition-colors">
                          <div>
                            <h3 className="text-lg font-medium">{guide.title}</h3>
                            <p className="text-muted-foreground">{guide.description}</p>
                          </div>
                          <Button variant="link" size="sm">
                            Learn More
                            <ExternalLink className="w-4 h-4 ml-1" />
                          </Button>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </motion.div>
          </div>
        </main>
        
        <Footer />
      </div>
    </AnimatedTransition>
  );
};

export default Support;

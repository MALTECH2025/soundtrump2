
import { useState } from 'react';
import { motion } from 'framer-motion';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { MessageCircle, LifeBuoy, FileQuestion, HelpCircle, Info, User, Coins, Link, Users, HeadphonesIcon } from 'lucide-react';
import { toast } from '@/lib/toast';
import AnimatedTransition from '@/components/ui/AnimatedTransition';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useNavigate } from 'react-router-dom';

const supportFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  subject: z.string().min(5, {
    message: "Subject must be at least 5 characters.",
  }),
  message: z.string().min(10, {
    message: "Message must be at least 10 characters.",
  }),
});

type SupportFormValues = z.infer<typeof supportFormSchema>;

// New improved FAQ content organized by categories
const faqCategories = [
  {
    id: "general",
    icon: <Info className="h-5 w-5 text-primary mr-2" />,
    title: "General Questions",
    items: [
      {
        question: "What is SoundTrump?",
        answer: "SoundTrump is a music-based earning platform where users complete tasks related to music streaming and social media engagement to earn ST Coins. These coins can be redeemed for rewards, making it an innovative way for users to engage with music while earning incentives."
      },
      {
        question: "How does SoundTrump work?",
        answer: "SoundTrump operates through a task-based system, where users earn rewards by: streaming music on supported platforms (Spotify, YouTube, etc.), following artists on social media, liking, sharing, or commenting on music content, and referring friends to SoundTrump. These activities contribute to the growth of artists while allowing users to accumulate ST Coins, which can later be redeemed for digital or physical rewards."
      }
    ]
  },
  {
    id: "account",
    icon: <User className="h-5 w-5 text-primary mr-2" />,
    title: "Account & Profile Management",
    items: [
      {
        question: "How do I create an account?",
        answer: "To sign up for SoundTrump: Visit soundtrump.com and click on Sign Up. Enter your email address and password or sign up with Google or Apple ID. Complete your profile setup and start earning rewards."
      },
      {
        question: "How do I reset my password?",
        answer: "If you forget your password: Go to the Login Page and click on Forgot Password. Enter your registered email address. Check your inbox for the password reset link and follow the instructions."
      },
      {
        question: "How do I edit my profile information?",
        answer: "You can update your username, profile picture, email, and password in the Account Settings section under the Profile page."
      },
      {
        question: "How can I delete my account?",
        answer: "If you want to permanently delete your SoundTrump account, submit a deletion request via the Support Page. Note that this action is irreversible, and you will lose all earned rewards."
      }
    ]
  },
  {
    id: "tasks",
    icon: <Coins className="h-5 w-5 text-primary mr-2" />,
    title: "Tasks & Rewards",
    items: [
      {
        question: "How do I complete tasks on SoundTrump?",
        answer: "Users can complete tasks by visiting the Tasks section and following the instructions provided for each task type. Tasks may include: streaming a song on Spotify or YouTube, following an artist on Instagram or TikTok, liking or commenting on a music-related post. Each task will show the number of ST Coins rewarded upon completion."
      },
      {
        question: "How long does task verification take?",
        answer: "Automated tasks (such as linking an account) are verified instantly. Manual verification tasks (such as posting a screenshot of an action) may take up to 24 hours."
      },
      {
        question: "How do I claim my rewards?",
        answer: "Navigate to the Rewards page. Select the reward you want and confirm your ST Coin balance. Follow the on-screen instructions to redeem your reward."
      }
    ]
  },
  {
    id: "connected",
    icon: <Link className="h-5 w-5 text-primary mr-2" />,
    title: "Connected Services",
    items: [
      {
        question: "How do I connect my Spotify account to SoundTrump?",
        answer: "Users can now link their Spotify account under the Account Settings > Connected Services section. This allows SoundTrump to track completed music streaming tasks for verification. Steps to connect your Spotify account: Go to Account Settings > Connected Services. Click on Connect Spotify. Authorize SoundTrump to access your Spotify listening activity. Once connected, completed streaming tasks will be automatically verified."
      },
      {
        question: "What other streaming services can I connect?",
        answer: "Currently, only Spotify is supported, but Apple Music and YouTube Music will be added in future updates."
      }
    ]
  },
  {
    id: "referrals",
    icon: <Users className="h-5 w-5 text-primary mr-2" />,
    title: "Referrals & Leaderboard",
    items: [
      {
        question: "How does the referral system work?",
        answer: "Users can invite their friends to SoundTrump and earn bonus ST Coins for every successful signup using their referral link. The more friends you invite, the more rewards you can earn."
      },
      {
        question: "How does the leaderboard ranking work?",
        answer: "The leaderboard ranks users based on: total ST Coins earned from tasks and referrals, active participation in SoundTrump events. Top-ranked users may receive special bonuses and extra rewards."
      }
    ]
  },
  {
    id: "support",
    icon: <HeadphonesIcon className="h-5 w-5 text-primary mr-2" />,
    title: "Support & Contact",
    items: [
      {
        question: "How can I contact SoundTrump support?",
        answer: "If you need help, you can: Submit a support ticket via the Support Page. Email customer service at support@soundtrump.com."
      },
      {
        question: "What should I do if my ST Coins are missing?",
        answer: "If your task was completed but rewards are missing, follow these steps: Go to Account > Completed Tasks and check if the task was successfully verified. If the task is still pending, wait up to 24 hours for manual review. If the issue persists, contact SoundTrump Support with proof of task completion."
      }
    ]
  }
];

const Support = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  const form = useForm<SupportFormValues>({
    resolver: zodResolver(supportFormSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  function onSubmit(data: SupportFormValues) {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log('Support request submitted:', data);
      toast.success("Your support request has been submitted. We'll get back to you soon.");
      form.reset();
      setLoading(false);
    }, 1500);
  }

  // Animation variants
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
              <h1 className="text-3xl md:text-4xl font-bold mb-4">Help & Support</h1>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Need help with SoundTrump? Our support team is here to assist you. Browse through our frequently asked questions or submit a support ticket.
              </p>
            </motion.div>
            
            <Tabs defaultValue="help" className="w-full mb-12">
              <TabsList className="mb-6 grid grid-cols-3 max-w-md mx-auto">
                <TabsTrigger value="help"><HelpCircle className="w-4 h-4 mr-2" /> Get Help</TabsTrigger>
                <TabsTrigger value="faq"><FileQuestion className="w-4 h-4 mr-2" /> FAQs</TabsTrigger>
                <TabsTrigger value="contact"><MessageCircle className="w-4 h-4 mr-2" /> Contact</TabsTrigger>
              </TabsList>
              
              <TabsContent value="help">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card className="col-span-1 md:col-span-2">
                    <CardHeader>
                      <CardTitle>Submit a Support Ticket</CardTitle>
                      <CardDescription>
                        Fill out the form below and our support team will get back to you as soon as possible.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                              control={form.control}
                              name="name"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Name</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Your name" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={form.control}
                              name="email"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Email</FormLabel>
                                  <FormControl>
                                    <Input placeholder="email@example.com" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          
                          <FormField
                            control={form.control}
                            name="subject"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Subject</FormLabel>
                                <FormControl>
                                  <Input placeholder="What is your issue about?" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="message"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Message</FormLabel>
                                <FormControl>
                                  <Textarea 
                                    placeholder="Please describe your issue in detail"
                                    className="min-h-[120px]"
                                    {...field} 
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <Button type="submit" className="w-full md:w-auto" disabled={loading}>
                            {loading ? "Submitting..." : "Submit Ticket"}
                          </Button>
                        </form>
                      </Form>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Help Resources</CardTitle>
                      <CardDescription>
                        Additional ways to get help with SoundTrump
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="flex items-center gap-3 p-3 rounded-md border hover:bg-muted/50 transition cursor-pointer" onClick={() => toast.success("Knowledge base coming soon!")}>
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <FileQuestion className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium">Knowledge Base</h3>
                          <p className="text-sm text-muted-foreground">
                            Browse our help articles
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 p-3 rounded-md border hover:bg-muted/50 transition cursor-pointer" onClick={() => toast.success("Live chat coming soon!")}>
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <MessageCircle className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium">Live Chat</h3>
                          <p className="text-sm text-muted-foreground">
                            Chat with support team
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 p-3 rounded-md border hover:bg-muted/50 transition cursor-pointer" onClick={() => toast.success("Community forum coming soon!")}>
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <LifeBuoy className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium">Community Forum</h3>
                          <p className="text-sm text-muted-foreground">
                            Get help from other users
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="faq">
                <Card>
                  <CardHeader>
                    <CardTitle>Frequently Asked Questions</CardTitle>
                    <CardDescription>
                      Find answers to common questions about using SoundTrump
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {faqCategories.map((category) => (
                        <div key={category.id} className="mb-6">
                          <div className="flex items-center mb-3">
                            {category.icon}
                            <h2 className="text-xl font-semibold">{category.title}</h2>
                          </div>
                          <Accordion type="single" collapsible className="w-full">
                            {category.items.map((item, idx) => (
                              <AccordionItem key={`${category.id}-${idx}`} value={`${category.id}-${idx}`}>
                                <AccordionTrigger className="text-left font-medium hover:no-underline">
                                  {item.question}
                                </AccordionTrigger>
                                <AccordionContent className="text-muted-foreground">
                                  <div className="space-y-2">
                                    {item.answer.split('. ').map((sentence, i) => (
                                      <p key={i} className={`${i > 0 ? 'mt-2' : ''}`}>
                                        {sentence.endsWith('.') ? sentence : `${sentence}.`}
                                      </p>
                                    ))}
                                  </div>
                                  
                                  {/* Add relevant action buttons for some FAQ items */}
                                  {category.id === "tasks" && item.question.includes("claim my rewards") && (
                                    <Button 
                                      variant="outline" 
                                      className="mt-4"
                                      onClick={() => navigate('/rewards')}
                                    >
                                      Go to Rewards
                                    </Button>
                                  )}
                                  
                                  {category.id === "account" && item.question.includes("edit my profile") && (
                                    <Button 
                                      variant="outline" 
                                      className="mt-4"
                                      onClick={() => navigate('/profile')}
                                    >
                                      Go to Profile
                                    </Button>
                                  )}
                                  
                                  {category.id === "connected" && item.question.includes("connect my Spotify") && (
                                    <Button 
                                      variant="outline" 
                                      className="mt-4"
                                      onClick={() => navigate('/settings')}
                                    >
                                      Connected Services
                                    </Button>
                                  )}
                                  
                                  {category.id === "referrals" && item.question.includes("referral system") && (
                                    <Button 
                                      variant="outline" 
                                      className="mt-4"
                                      onClick={() => navigate('/referrals')}
                                    >
                                      Go to Referrals
                                    </Button>
                                  )}
                                </AccordionContent>
                              </AccordionItem>
                            ))}
                          </Accordion>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <p className="text-sm text-muted-foreground">
                      Didn't find what you're looking for? <Button variant="link" className="p-0 h-auto" onClick={() => {
                        const contactTab = document.querySelector('[data-state="inactive"][data-value="contact"]') as HTMLElement;
                        if (contactTab) contactTab.click();
                      }}>Contact our support team</Button>
                    </p>
                  </CardFooter>
                </Card>
              </TabsContent>
              
              <TabsContent value="contact">
                <Card>
                  <CardHeader>
                    <CardTitle>Contact Information</CardTitle>
                    <CardDescription>
                      Here's how you can reach our team
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="p-6 border rounded-lg">
                        <h3 className="font-medium text-lg mb-3">Support Team</h3>
                        <p className="text-muted-foreground mb-4">
                          For general inquiries and technical support
                        </p>
                        <p className="flex items-center gap-2">
                          <MessageCircle className="h-4 w-4" />
                          <span>support@soundtrump.com</span>
                        </p>
                        <p className="text-xs text-muted-foreground mt-4">
                          Typically responds within 24 hours
                        </p>
                      </div>
                      
                      <div className="p-6 border rounded-lg">
                        <h3 className="font-medium text-lg mb-3">Partnerships</h3>
                        <p className="text-muted-foreground mb-4">
                          For business inquiries and partnership opportunities
                        </p>
                        <p className="flex items-center gap-2">
                          <MessageCircle className="h-4 w-4" />
                          <span>partners@soundtrump.com</span>
                        </p>
                        <p className="text-xs text-muted-foreground mt-4">
                          Typically responds within 2-3 business days
                        </p>
                      </div>
                    </div>
                    
                    <div className="text-center p-6 mt-4">
                      <h3 className="font-medium text-lg mb-3">Submit a Ticket</h3>
                      <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                        For faster assistance, please submit a support ticket with details about your issue.
                      </p>
                      <Button onClick={() => {
                        const helpTab = document.querySelector('[data-state="inactive"][data-value="help"]') as HTMLElement;
                        if (helpTab) helpTab.click();
                      }}>
                        Create Support Ticket
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
        
        <Footer />
      </div>
    </AnimatedTransition>
  );
};

export default Support;


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
import { MessageCircle, LifeBuoy, FileQuestion, HelpCircle } from 'lucide-react';
import { toast } from '@/lib/toast';
import AnimatedTransition from '@/components/ui/AnimatedTransition';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

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

const faqItems = [
  {
    question: "How do I earn rewards?",
    answer: "You can earn rewards by completing tasks related to music streaming services, referring friends, and participating in promotions."
  },
  {
    question: "When will I receive my rewards?",
    answer: "Rewards are typically processed within 7 days after completing eligible activities and will appear in your rewards dashboard."
  },
  {
    question: "How do I link my streaming accounts?",
    answer: "Go to the Settings page, navigate to the Connections tab, and click the Connect button next to your preferred streaming service."
  },
  {
    question: "Can I cash out my rewards?",
    answer: "Yes, you can convert your rewards to various options including gift cards, cryptocurrency, or exclusive merchandise."
  },
  {
    question: "What happens if I encounter technical issues?",
    answer: "If you experience any technical difficulties, please contact our support team by submitting a ticket on this page."
  }
];

const Support = () => {
  const [loading, setLoading] = useState(false);
  
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
                      {faqItems.map((item, index) => (
                        <div key={index} className="border-b pb-4 last:border-0">
                          <h3 className="font-medium text-lg mb-2">{item.question}</h3>
                          <p className="text-muted-foreground">{item.answer}</p>
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
